const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// Tüm route'lar için authentication gerekli
router.use(protect);

router.post('/', workoutController.createWorkout);
router.get('/', workoutController.getWorkouts);
router.get('/:id', workoutController.getWorkout);
router.put('/:id', workoutController.updateWorkout);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router; 