const Workout = require('../models/Workout');

// Haftalık antrenmanları getir
const getWeeklyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.user._id,
      isTemplate: true
    }).sort({ weekDay: 1 });

    res.json(workouts);
  } catch (error) {
    console.error('Haftalık antrenmanları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yeni antrenman oluştur
const createWorkout = async (req, res) => {
  try {
    // Aynı gün için önceki şablonu kontrol et
    const existingWorkout = await Workout.findOne({
      userId: req.user._id,
      weekDay: req.body.weekDay,
      isTemplate: true
    });

    if (existingWorkout) {
      // Varolan şablonu güncelle
      const updatedWorkout = await Workout.findByIdAndUpdate(
        existingWorkout._id,
        { ...req.body, userId: req.user._id, isTemplate: true },
        { new: true }
      );
      return res.json(updatedWorkout);
    }

    // Yeni şablon oluştur
    const workout = new Workout({
      ...req.body,
      userId: req.user._id,
      isTemplate: true
    });
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Bu gün için zaten bir antrenman programı mevcut.' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Tüm antrenmanları getir
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ 
      userId: req.user._id,
      isTemplate: true 
    }).sort({ weekDay: 1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir antrenmanı getir
const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!workout) {
      return res.status(404).json({ message: 'Antrenman bulunamadı' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Antrenmanı güncelle
const updateWorkout = async (req, res) => {
  try {
    // Eğer gün değiştiyse, yeni gün için çakışma kontrolü yap
    if (req.body.weekDay) {
      const existingWorkout = await Workout.findOne({
        userId: req.user._id,
        weekDay: req.body.weekDay,
        isTemplate: true,
        _id: { $ne: req.params.id }
      });

      if (existingWorkout) {
        return res.status(400).json({ 
          message: 'Bu gün için zaten bir antrenman programı mevcut.' 
        });
      }
    }

    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { ...req.body, isTemplate: true },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Antrenman bulunamadı' });
    }
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Antrenmanı sil
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!workout) {
      return res.status(404).json({ message: 'Antrenman bulunamadı' });
    }
    res.json({ message: 'Antrenman silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWeeklyWorkouts,
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout
}; 