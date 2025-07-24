const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/db');

const createAdminUser = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB bağlantısı başarılı');

    // Admin kullanıcısının varlığını kontrol et
    const existingAdmin = await User.findOne({ email: 'ledogan80@gmail.com' });

    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('✅ Admin kullanıcısı zaten mevcut');
        return;
      } else {
        // Mevcut kullanıcıyı admin yap
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('✅ Mevcut kullanıcı admin rolüne yükseltildi');
        return;
      }
    }

    // Yeni admin kullanıcısı oluştur
    const adminUser = new User({
      email: 'ledogan80@gmail.com',
      password: '805680mad',
      name: 'Admin',
      role: 'admin',
      isActive: true,
      age: 30,
      gender: 'erkek',
      height: 175,
      weight: 75,
      goal: 'form_koruma',
      activityLevel: 'orta_aktif',
      dailyCalorieTarget: 2200,
      macroTargets: {
        protein: 150,
        carbs: 250,
        fat: 80
      }
    });

    await adminUser.save();
    console.log('🎉 Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('📧 Email: ledogan80@gmail.com');
    console.log('🔐 Şifre: 805680mad');
    console.log('👑 Role: admin');

  } catch (error) {
    console.error('❌ Admin kullanıcısı oluşturulurken hata:', error);
  } finally {
    // MongoDB bağlantısını kapat
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
};

// Script'i çalıştır
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser; 