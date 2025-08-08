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

  // Send newsletter to subscribers
  async sendNewsletter(subject, content, subscribers) {
    try {
      const results = [];
      
      for (const subscriber of subscribers) {
        const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        
        const mailOptions = {
          from: process.env.SMTP_FROM || 'noreply@fitplanner.com',
          to: subscriber.email,
          subject: `FitPlanner Newsletter - ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #3B82F6;">FitPlanner</h1>
                <h2 style="color: #1F2937; margin-top: 10px;">${subject}</h2>
              </div>
              
              ${subscriber.name ? `<p style="color: #4B5563;">Merhaba ${subscriber.name}!</p>` : ''}
              
              <div style="color: #4B5563; line-height: 1.6; margin: 20px 0;">
                ${content}
              </div>
              
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                   style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  FitPlanner'ı Ziyaret Et
                </a>
              </div>
              
              <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
                Bu e-postayı ${subscriber.email} adresine FitPlanner newsletter aboneliğiniz nedeniyle aldınız.<br>
                <a href="${unsubscribeUrl}" style="color: #9CA3AF;">Abonelikten çık</a>
              </p>
            </div>
          `
        };

        try {
          const result = await this.sendEmail(mailOptions);
          results.push({
            email: subscriber.email,
            success: result.success,
            messageId: result.messageId,
            error: result.error
          });
        } catch (error) {
          results.push({
            email: subscriber.email,
            success: false,
            error: error.message
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        success: true,
        totalSent: successful,
        totalFailed: failed,
        results
      };

    } catch (error) {
      console.error('Newsletter sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send welcome email to new subscribers
  async sendWelcomeEmail(userEmail, userName) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@fitplanner.com',
      to: userEmail,
      subject: 'FitPlanner\'a Hoş Geldiniz! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6;">FitPlanner</h1>
          </div>
          
          <h2 style="color: #1F2937;">Hoş Geldiniz ${userName || 'Değerli Abone'}! 🎉</h2>
          
          <p style="color: #4B5563; line-height: 1.6;">
            FitPlanner newsletter ailesine katıldığınız için teşekkür ederiz! Artık fitness dünyasından en güncel haberleri, 
            egzersiz ipuçlarını ve beslenme önerilerini ilk öğrenen kişilerden olacaksınız.
          </p>
          
          <div style="background-color: #F0F9FF; border: 1px solid #0EA5E9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0C4A6E; margin-top: 0;">Newsletter'ımızda neler bulacaksınız:</h3>
            <ul style="color: #075985; margin-bottom: 0;">
              <li>Haftalık workout programları</li>
              <li>Sağlıklı beslenme tarifleri</li>
              <li>Fitness motivasyon hikayeleri</li>
              <li>Uzman antrenörlerden özel ipuçları</li>
              <li>Yeni özellik duyuruları</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
               style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              FitPlanner'ı Keşfet
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Herhangi bir sorunuz varsa veya geri bildirimde bulunmak istiyorsanız, bize ulaşmaktan çekinmeyin!
          </p>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Bu e-posta FitPlanner ekibi tarafından gönderilmiştir.
          </p>
        </div>
      `
    };

    return this.sendEmail(mailOptions);
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