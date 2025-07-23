const express = require('express');
const router = express.Router();
const { 
  createWorkout, 
  getWorkouts, 
  getWorkout, 
  updateWorkout, 
  deleteWorkout,
  getWeeklyWorkouts 
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// Tüm route'lar için auth middleware'i kullan
router.use(protect);

// Haftalık antrenmanları getir
router.get('/weekly', getWeeklyWorkouts);

// Diğer route'lar
router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router; 