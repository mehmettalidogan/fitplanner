const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

// Global arama
router.get('/search', authMiddleware, searchController.globalSearch);

// Arama önerileri
router.get('/suggestions', authMiddleware, searchController.getSearchSuggestions);

module.exports = router; 