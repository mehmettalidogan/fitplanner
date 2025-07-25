const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');
const WeightEntry = require('../models/WeightEntry');

// Analytics routes
router.get('/summary', authMiddleware, analyticsController.getAnalyticsSummary);
router.get('/workouts', authMiddleware, analyticsController.getWorkoutAnalytics);
router.get('/nutrition', authMiddleware, analyticsController.getNutritionAnalytics);
router.get('/progress', authMiddleware, analyticsController.getProgressReport);

// Weight tracking routes
router.get('/weight', authMiddleware, async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const result = await WeightEntry.getWeightStats(req.userId, period);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Weight data alınırken hata oluştu.' });
  }
});

router.post('/weight', authMiddleware, async (req, res) => {
  try {
    const { weight, date, notes, bodyFat, muscleMass } = req.body;
    
    const weightEntry = new WeightEntry({
      userId: req.userId,
      weight,
      date: date || new Date(),
      notes,
      bodyFat,
      muscleMass
    });

    await weightEntry.save();
    res.status(201).json(weightEntry);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Bu tarih için zaten bir kayıt var.' });
    } else {
      res.status(500).json({ message: 'Weight kaydı oluşturulurken hata oluştu.' });
    }
  }
});

router.put('/weight/:id', authMiddleware, async (req, res) => {
  try {
    const { weight, notes, bodyFat, muscleMass } = req.body;
    
    const weightEntry = await WeightEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { weight, notes, bodyFat, muscleMass },
      { new: true }
    );

    if (!weightEntry) {
      return res.status(404).json({ message: 'Weight kaydı bulunamadı.' });
    }

    res.json(weightEntry);
  } catch (error) {
    res.status(500).json({ message: 'Weight kaydı güncellenirken hata oluştu.' });
  }
});

router.delete('/weight/:id', authMiddleware, async (req, res) => {
  try {
    const weightEntry = await WeightEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!weightEntry) {
      return res.status(404).json({ message: 'Weight kaydı bulunamadı.' });
    }

    res.json({ message: 'Weight kaydı silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Weight kaydı silinirken hata oluştu.' });
  }
});

module.exports = router; 