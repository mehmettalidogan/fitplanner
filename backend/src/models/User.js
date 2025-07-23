const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['erkek', 'kadın', 'diğer']
  },
  height: {
    type: Number,
    min: 0,
    max: 300 // cm cinsinden
  },
  weight: {
    type: Number,
    min: 0,
    max: 500 // kg cinsinden
  },
  goal: {
    type: String,
    enum: ['kilo_verme', 'kilo_alma', 'kas_kazanma', 'form_koruma']
  },
  activityLevel: {
    type: String,
    enum: ['sedanter', 'az_aktif', 'orta_aktif', 'cok_aktif', 'ekstra_aktif']
  },
  dailyCalorieTarget: {
    type: Number,
    min: 0
  },
  macroTargets: {
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  },
  profileImage: {
    type: String,
    default: '/img/default-profile.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 