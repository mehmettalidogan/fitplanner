const nodemailer = require('nodemailer');
const config = require('../config/db');

class EmailService {
  constructor() {
    // For development, use ethereal email (fake SMTP)
    // In production, use real SMTP service like SendGrid, AWS SES, etc.
    this.transporter = null;
    this.init();
  }

  async init() {
    try {
      if (process.env.NODE_ENV === 'production') {
        // Production SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      } else {
        // Development - use ethereal email
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }
    } catch (error) {
      console.error('Email service initialization failed:', error);
    }
  }

  async sendVerificationEmail(userEmail, userName, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@fitplanner.com',
      to: userEmail,
      subject: 'FitPlanner - E-posta Adresinizi Doğrulayın',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6;">FitPlanner</h1>
          </div>
          
          <h2 style="color: #1F2937;">Merhaba ${userName}!</h2>
          
          <p style="color: #4B5563; line-height: 1.6;">
            FitPlanner'a hoş geldiniz! Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekmektedir.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              E-posta Adresimi Doğrula
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Bu link 24 saat süreyle geçerlidir. Eğer bu e-postayı siz talep etmediyseniz, güvenle görmezden gelebilirsiniz.
          </p>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Bu e-posta FitPlanner tarafından otomatik olarak gönderilmiştir.
          </p>
        </div>
      `
    };

    return this.sendEmail(mailOptions);
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@fitplanner.com',
      to: userEmail,
      subject: 'FitPlanner - Şifre Sıfırlama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6;">FitPlanner</h1>
          </div>
          
          <h2 style="color: #1F2937;">Merhaba ${userName}!</h2>
          
          <p style="color: #4B5563; line-height: 1.6;">
            Şifre sıfırlama talebinizi aldık. Yeni bir şifre oluşturmak için aşağıdaki butona tıklayın:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Şifremi Sıfırla
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Bu link 1 saat süreyle geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelin.
          </p>
          
          <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #92400E; margin: 0; font-size: 14px;">
              <strong>Güvenlik Uyarısı:</strong> Şifrenizi kimseyle paylaşmayın ve güvenilir olmayan bağlantılara tıklamayın.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Bu e-posta FitPlanner tarafından otomatik olarak gönderilmiştir.
          </p>
        </div>
      `
    };

    return this.sendEmail(mailOptions);
  }

  async sendSecurityAlert(userEmail, userName, alertType, details) {
    const subject = this.getSecurityAlertSubject(alertType);
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@fitplanner.com',
      to: userEmail,
      subject: `FitPlanner - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6;">FitPlanner</h1>
          </div>
          
          <div style="background-color: #FEF2F2; border: 1px solid #FECACA; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #DC2626; margin-top: 0;">🔐 Güvenlik Uyarısı</h2>
            <p style="color: #7F1D1D; margin-bottom: 0;">
              Hesabınızda şüpheli bir aktivite tespit edildi.
            </p>
          </div>
          
          <h3 style="color: #1F2937;">Merhaba ${userName}!</h3>
          
          <p style="color: #4B5563; line-height: 1.6;">
            ${details}
          </p>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #374151; margin-top: 0;">Güvenlik Önerileri:</h4>
            <ul style="color: #4B5563; margin-bottom: 0;">
              <li>Şifrenizi güçlü ve benzersiz tutun</li>
              <li>İki faktörlü doğrulamayı etkinleştirin</li>
              <li>Hesabınızı düzenli olarak kontrol edin</li>
              <li>Şüpheli aktivite fark ederseniz hemen iletişime geçin</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/security" 
               style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Güvenlik Ayarlarını Kontrol Et
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Bu e-posta FitPlanner güvenlik sistemi tarafından otomatik olarak gönderilmiştir.
          </p>
        </div>
      `
    };

    return this.sendEmail(mailOptions);
  }

  getSecurityAlertSubject(alertType) {
    const subjects = {
      'suspicious_login': 'Şüpheli Giriş Denemesi',
      'password_change': 'Şifre Değiştirildi',
      'email_change': 'E-posta Adresi Değiştirildi',
      'multiple_failed_logins': 'Çoklu Başarısız Giriş Denemesi',
      'new_device_login': 'Yeni Cihazdan Giriş',
      '2fa_disabled': 'İki Faktörlü Doğrulama Devre Dışı Bırakıldı'
    };
    
    return subjects[alertType] || 'Güvenlik Uyarısı';
  }

  async sendEmail(mailOptions) {
    try {
      if (!this.transporter) {
        await this.init();
      }

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Test email sent:', nodemailer.getTestMessageUrl(info));
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test email connection
  async testConnection() {
    try {
      if (!this.transporter) {
        await this.init();
      }
      
      await this.transporter.verify();
      return { success: true, message: 'Email service is working' };
    } catch (error) {
      console.error('Email connection test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService(); 