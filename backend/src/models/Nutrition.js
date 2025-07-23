const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  foods: [{
    name: {
      type: String,
      required: true
    },
    portion: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }],
  time: {
    type: String,
    required: true
  }
});

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [mealSchema],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema); 