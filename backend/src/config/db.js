const dotenv = require('dotenv');

// Environment variables'ı yükle
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitplanner',
  jwtSecret: process.env.JWT_SECRET || 'gizli-anahtar-geliştirme-ortamı-için',
  port: process.env.PORT || 5000
}; 