const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/db');

const adminMiddleware = async (req, res, next) => {
  try {
    // Token kontrolü
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim reddedildi. Admin girişi gerekli.'
      });
    }

    // Token decode
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // User bulma ve admin kontrolü
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token. Kullanıcı bulunamadı.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Hesap deaktif durumda.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için admin yetkisi gerekli.'
      });
    }

    // Admin kullanıcı bilgilerini request'e ekle
    req.user = user;
    req.admin = true;
    
    next();

  } catch (error) {
    console.error('Admin middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş. Lütfen tekrar giriş yapın.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Sunucu hatası.'
    });
  }
};

module.exports = adminMiddleware; 