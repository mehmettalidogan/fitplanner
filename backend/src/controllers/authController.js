const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
    }

    // Yeni kullanıcı oluşturma
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Kayıt işlemi sırasında bir hata oluştu.' });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcı kontrolü
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Aktif kullanıcı kontrolü
    if (!user.isActive) {
      return res.status(401).json({ message: 'Hesabınız deaktif durumda. Lütfen yönetici ile iletişime geçin.' });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.role === 'admin',
        lastLogin: user.lastLogin
      },
      message: user.role === 'admin' ? 'Admin girişi başarılı! Hoş geldiniz! 👑' : 'Giriş başarılı! Hoş geldiniz! 🎉'
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Giriş işlemi sırasında bir hata oluştu.' });
  }
};

// Kullanıcı profili getirme
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ message: 'Profil bilgileri alınırken bir hata oluştu.' });
  }
};

// Kullanıcı profili güncelleme
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['age', 'gender', 'height', 'weight', 'goal', 'activityLevel'];
    
    // Sadece izin verilen alanların güncellenmesi
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        if (updates[key] !== '') {
          obj[key] = updates[key];
        }
        return obj;
      }, {});

    // Günlük kalori ve makro hedeflerini hesaplama
    if (updates.weight && updates.height && updates.age && updates.gender && updates.activityLevel) {
      let bmr = 0;
      
      // Harris-Benedict denklemi
      if (updates.gender === 'erkek') {
        bmr = 88.362 + (13.397 * updates.weight) + (4.799 * updates.height) - (5.677 * updates.age);
      } else {
        bmr = 447.593 + (9.247 * updates.weight) + (3.098 * updates.height) - (4.330 * updates.age);
      }

      // Aktivite seviyesine göre çarpan
      const activityMultipliers = {
        sedanter: 1.2,
        az_aktif: 1.375,
        orta_aktif: 1.55,
        cok_aktif: 1.725,
        ekstra_aktif: 1.9
      };

      const dailyCalories = Math.round(bmr * activityMultipliers[updates.activityLevel]);

      // Hedeflere göre kalori ayarlama
      let targetCalories = dailyCalories;
      if (updates.goal === 'kilo_verme') {
        targetCalories = Math.round(dailyCalories * 0.8); // %20 kalori açığı
      } else if (updates.goal === 'kilo_alma') {
        targetCalories = Math.round(dailyCalories * 1.2); // %20 kalori fazlası
      }

      // Makro hedeflerini hesaplama
      let proteinTarget, carbsTarget, fatTarget;

      switch(updates.goal) {
        case 'kas_kazanma':
          // Yüksek protein, orta karbonhidrat, düşük yağ
          proteinTarget = Math.round(updates.weight * 2.2); // 2.2g/kg
          fatTarget = Math.round((targetCalories * 0.2) / 9); // Toplam kalorinin %20'si
          carbsTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
          break;
        
        case 'kilo_verme':
          // Yüksek protein, düşük karbonhidrat, orta yağ
          proteinTarget = Math.round(updates.weight * 2); // 2g/kg
          fatTarget = Math.round((targetCalories * 0.25) / 9); // Toplam kalorinin %25'i
          carbsTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
          break;
        
        case 'kilo_alma':
          // Orta protein, yüksek karbonhidrat, orta yağ
          proteinTarget = Math.round(updates.weight * 1.8); // 1.8g/kg
          fatTarget = Math.round((targetCalories * 0.25) / 9); // Toplam kalorinin %25'i
          carbsTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
          break;
        
        default: // form_koruma
          // Dengeli makrolar
          proteinTarget = Math.round(updates.weight * 1.6); // 1.6g/kg
          fatTarget = Math.round((targetCalories * 0.3) / 9); // Toplam kalorinin %30'u
          carbsTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
      }

      filteredUpdates.dailyCalorieTarget = targetCalories;
      filteredUpdates.macroTargets = {
        protein: proteinTarget,
        carbs: carbsTarget,
        fat: fatTarget
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Profil güncellenirken bir hata oluştu.' });
  }
}; 