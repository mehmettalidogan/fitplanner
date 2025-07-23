const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    // Token kontrolü
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız. Token bulunamadı.' });
    }

    // Token'ı ayıkla
    const token = authHeader.split(' ')[1];

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Kullanıcıyı bul
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Yetkilendirme başarısız. Kullanıcı bulunamadı.' });
      }

      // Request nesnesine kullanıcı bilgisini ekle
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız. Geçersiz token.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = authMiddleware; 