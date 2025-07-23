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
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  notes: String
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekDay: {
    type: String,
    required: true,
    enum: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
  },
  name: {
    type: String,
    required: true
  },
  exercises: [exerciseSchema],
  notes: String,
  isTemplate: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Aynı gün için birden fazla şablon olmamasını sağla
workoutSchema.index({ userId: 1, weekDay: 1 }, { unique: true });

module.exports = mongoose.model('Workout', workoutSchema); 