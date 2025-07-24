const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { updatePreferences, getRecommendations } = require('../controllers/recommendationController');

// Kullanıcı tercihlerini güncelleme
router.post('/preferences', authMiddleware, updatePreferences);

// Önerileri getirme
router.get('/', authMiddleware, getRecommendations);

module.exports = router; 