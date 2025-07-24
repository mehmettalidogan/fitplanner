const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  subscribe,
  unsubscribe,
  getSubscriber,
  updatePreferences,
  getStats,
  getAllSubscribers
} = require('../controllers/newsletterController');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/subscriber/:email', getSubscriber);
router.put('/subscriber/:email/preferences', updatePreferences);

// Admin routes (protected)
router.get('/stats', authMiddleware, getStats);
router.get('/subscribers', authMiddleware, getAllSubscribers);

module.exports = router; 