const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm route'lar için authentication gerekli
router.use(authMiddleware);

router.post('/', nutritionController.createNutrition);
router.get('/', nutritionController.getNutritions);
router.get('/daily-macros', nutritionController.getDailyMacros);
router.get('/weekly-macros', nutritionController.getWeeklyMacros);
router.get('/:id', nutritionController.getNutrition);
router.put('/:id', nutritionController.updateNutrition);
router.delete('/:id', nutritionController.deleteNutrition);

module.exports = router; 