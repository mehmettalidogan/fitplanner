const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: String, // "12", "30 sn", "6-8" gibi değerler için string
    required: true
  },
  weight: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
});

const workoutDaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  exercises: [exerciseSchema]
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'yoga'],
    required: true
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  daysPerWeek: {
    type: Number,
    required: true
  },
  targetGoals: [{
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength', 'flexibility']
  }],
  workoutDays: [workoutDaySchema],
  estimatedTime: {
    type: Number, // dakika cinsinden
    required: true
  },
  caloriesBurn: {
    type: Number,
    required: true
  },
  // Dashboard için ek alanlar
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekDay: {
    type: String // "Pazartesi", "Gün 1" gibi
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  exercises: [exerciseSchema], // Dashboard'da direkt exercises array'i kullanılıyor
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', workoutSchema); 