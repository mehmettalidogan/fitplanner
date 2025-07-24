const mongoose = require('mongoose');

// Yiyecek şeması
const foodSchema = new mongoose.Schema({
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
    required: true,
    default: 'gram'
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  }
});

// Öğün şeması
const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  foods: [foodSchema]
});

// Ana beslenme şeması (günlük beslenme planı)
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
  notes: {
    type: String
  },
  // Hesaplanan toplam değerler
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Nutrition', nutritionSchema); 