const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const securityController = require('../controllers/securityController');

// Email verification routes
router.post('/send-verification', authMiddleware, securityController.sendEmailVerification);
router.post('/verify-email', securityController.verifyEmail);

// 2FA routes
router.post('/2fa/setup', authMiddleware, securityController.setup2FA);
router.post('/2fa/verify', authMiddleware, securityController.verify2FA);
router.post('/2fa/disable', authMiddleware, securityController.disable2FA);

// Security logs and summary
router.get('/logs', authMiddleware, securityController.getSecurityLogs);
router.get('/summary', authMiddleware, securityController.getSecuritySummary);

// Security preferences
router.put('/preferences', authMiddleware, securityController.updateSecurityPreferences);

module.exports = router; 