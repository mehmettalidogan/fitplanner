const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
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
router.get('/stats', adminMiddleware, getStats);
router.get('/subscribers', adminMiddleware, getAllSubscribers);

module.exports = router; 