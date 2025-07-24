const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferences: {
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    workoutPreferences: [{
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'hiit', 'yoga']
    }],
    dietaryRestrictions: [{
      type: String
    }],
    goals: [{
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance']
    }]
  },
  recommendedWorkouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }],
  recommendedNutrition: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nutrition'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema); 