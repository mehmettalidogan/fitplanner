const Workout = require('../models/Workout');

// Yeni antrenman oluştur
exports.createWorkout = async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      userId: req.user._id
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Kullanıcının antrenmanlarını getir
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir antrenmanı getir
exports.getWorkout = async (req, res) => {
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
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
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
exports.deleteWorkout = async (req, res) => {
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