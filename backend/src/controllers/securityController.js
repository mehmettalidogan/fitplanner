const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');
const emailService = require('../services/emailService');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// E-posta doğrulama gönder
exports.sendEmailVerification = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'E-posta adresi zaten doğrulanmış.' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'E-posta gönderilirken hata oluştu.',
        error: emailResult.error 
      });
    }

    // Log security event
    await SecurityLog.create({
      userId,
      action: 'email_verification_sent',
      details: 'E-posta doğrulama linki gönderildi',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent') || 'Unknown'
    });

    res.json({
      message: 'Doğrulama e-postası gönderildi. E-posta kutunuzu kontrol edin.',
      previewUrl: emailResult.previewUrl // Development için
    });

  } catch (error) {
    console.error('Email verification send error:', error);
    res.status(500).json({ message: 'E-posta doğrulama gönderilirken hata oluştu.' });
  }
};

// E-posta doğrulama
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Doğrulama token\'ı gerekli.' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Geçersiz veya süresi dolmuş doğrulama token\'ı.' 
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Log security event
    await SecurityLog.create({
      userId: user._id,
      action: 'email_verified',
      details: 'E-posta adresi başarıyla doğrulandı',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent') || 'Unknown'
    });

    res.json({ message: 'E-posta adresi başarıyla doğrulandı.' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'E-posta doğrulama sırasında hata oluştu.' });
  }
};

// 2FA kurulum
exports.setup2FA = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (user.twoFactorAuth.enabled) {
      return res.status(400).json({ message: 'İki faktörlü doğrulama zaten etkin.' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `FitPlanner (${user.email})`,
      issuer: 'FitPlanner',
      length: 32
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push({
        code: crypto.randomBytes(4).toString('hex').toUpperCase(),
        used: false
      });
    }

    // Save secret (temporarily, will be confirmed when user verifies)
    user.twoFactorAuth.secret = secret.base32;
    user.twoFactorAuth.backupCodes = backupCodes;
    await user.save();

    res.json({
      qrCode: qrCodeUrl,
      secret: secret.base32,
      backupCodes: backupCodes.map(bc => bc.code),
      message: 'QR kodu tarattıktan sonra doğrulama kodunu girin.'
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ message: '2FA kurulumunda hata oluştu.' });
  }
};

// 2FA doğrulama ve etkinleştirme
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.userId;

    if (!token) {
      return res.status(400).json({ message: 'Doğrulama kodu gerekli.' });
    }

    const user = await User.findById(userId);
    if (!user || !user.twoFactorAuth.secret) {
      return res.status(400).json({ message: 'Geçersiz 2FA kurulumu.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Geçersiz doğrulama kodu.' });
    }

    user.twoFactorAuth.enabled = true;
    await user.save();

    // Log security event
    await SecurityLog.create({
      userId,
      action: '2fa_enabled',
      details: 'İki faktörlü doğrulama etkinleştirildi',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent') || 'Unknown'
    });

    res.json({ 
      message: 'İki faktörlü doğrulama başarıyla etkinleştirildi.',
      backupCodes: user.twoFactorAuth.backupCodes.map(bc => bc.code)
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: '2FA doğrulamasında hata oluştu.' });
  }
};

// 2FA devre dışı bırakma
exports.disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;

    if (!password) {
      return res.status(400).json({ message: 'Mevcut şifre gerekli.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Geçersiz şifre.' });
    }

    user.twoFactorAuth.enabled = false;
    user.twoFactorAuth.secret = undefined;
    user.twoFactorAuth.backupCodes = [];
    await user.save();

    // Log security event
    await SecurityLog.create({
      userId,
      action: '2fa_disabled',
      details: 'İki faktörlü doğrulama devre dışı bırakıldı',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent') || 'Unknown'
    });

    // Send security alert
    await emailService.sendSecurityAlert(
      user.email,
      user.name,
      '2fa_disabled',
      'Hesabınızda iki faktörlü doğrulama devre dışı bırakıldı. Bu işlemi siz yapmadıysanız derhal iletişime geçin.'
    );

    res.json({ message: 'İki faktörlü doğrulama devre dışı bırakıldı.' });

  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ message: '2FA devre dışı bırakılırken hata oluştu.' });
  }
};

// Güvenlik logları
exports.getSecurityLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, action, severity } = req.query;

    const filter = { userId };
    if (action) filter.action = action;
    if (severity) filter.severity = severity;

    const logs = await SecurityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-userId');

    const total = await SecurityLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });

  } catch (error) {
    console.error('Security logs error:', error);
    res.status(500).json({ message: 'Güvenlik logları alınırken hata oluştu.' });
  }
};

// Güvenlik özeti
exports.getSecuritySummary = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('emailVerified twoFactorAuth securityPreferences');
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const summary = await SecurityLog.getSecuritySummary(userId);

    res.json({
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorAuth.enabled,
      securityPreferences: user.securityPreferences,
      securityStats: summary
    });

  } catch (error) {
    console.error('Security summary error:', error);
    res.status(500).json({ message: 'Güvenlik özeti alınırken hata oluştu.' });
  }
};

// Güvenlik tercihlerini güncelle
exports.updateSecurityPreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const { loginNotifications, securityEmails } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    user.securityPreferences.loginNotifications = loginNotifications;
    user.securityPreferences.securityEmails = securityEmails;
    await user.save();

    // Log security event
    await SecurityLog.create({
      userId,
      action: 'security_preferences_updated',
      details: 'Güvenlik tercihleri güncellendi',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent') || 'Unknown'
    });

    res.json({ 
      message: 'Güvenlik tercihleri güncellendi.',
      preferences: user.securityPreferences 
    });

  } catch (error) {
    console.error('Security preferences update error:', error);
    res.status(500).json({ message: 'Güvenlik tercihleri güncellenirken hata oluştu.' });
  }
};

module.exports = exports; 