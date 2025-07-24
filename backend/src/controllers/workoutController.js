const Workout = require('../models/Workout');

// Haftalık antrenmanları getir
const getWeeklyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.user.userId,
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
    const { workoutDays, ...baseWorkoutData } = req.body;
    
    // Eğer workoutDays varsa (multi-day workout), her gün için ayrı template oluştur
    if (workoutDays && workoutDays.length > 0) {
      const createdWorkouts = [];
      
      for (let i = 0; i < workoutDays.length; i++) {
        const day = workoutDays[i];
        const weekDay = day.name || `Gün ${i + 1}`;
        
        // Bu gün için mevcut template'i kontrol et
        const existingWorkout = await Workout.findOne({
          userId: req.user.userId,
          weekDay: weekDay,
          isTemplate: true
        });

        const workoutData = {
          ...baseWorkoutData,
          name: `${baseWorkoutData.name} - ${weekDay}`,
          weekDay: weekDay,
          exercises: day.exercises,
          userId: req.user.userId,
          isTemplate: true
        };

        if (existingWorkout) {
          // Varolan şablonu güncelle
          const updatedWorkout = await Workout.findByIdAndUpdate(
            existingWorkout._id,
            workoutData,
            { new: true }
          );
          createdWorkouts.push(updatedWorkout);
        } else {
          // Yeni şablon oluştur
          const workout = new Workout(workoutData);
          const savedWorkout = await workout.save();
          createdWorkouts.push(savedWorkout);
        }
      }
      
      return res.status(201).json(createdWorkouts);
    }
    
    // Tek günlük workout (eski format)
    const existingWorkout = await Workout.findOne({
      userId: req.user.userId,
      weekDay: req.body.weekDay,
      isTemplate: true
    });

    if (existingWorkout) {
      const updatedWorkout = await Workout.findByIdAndUpdate(
        existingWorkout._id,
        { ...req.body, userId: req.user.userId, isTemplate: true },
        { new: true }
      );
      return res.json(updatedWorkout);
    }

    const workout = new Workout({
      ...req.body,
      userId: req.user.userId,
      isTemplate: true
    });
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Workout creation error:', error);
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
      userId: req.user.userId,
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
      userId: req.user.userId
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
        userId: req.user.userId,
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
        userId: req.user.userId
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
      userId: req.user.userId
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