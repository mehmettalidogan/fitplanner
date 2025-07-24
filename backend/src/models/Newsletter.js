const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Geçersiz email formatı'
    }
  },
  name: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['blog', 'homepage', 'programs', 'nutrition'],
    default: 'blog'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  preferences: {
    workoutTips: {
      type: Boolean,
      default: true
    },
    nutritionTips: {
      type: Boolean,
      default: true
    },
    newPrograms: {
      type: Boolean,
      default: true
    },
    blogUpdates: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referer: String
  }
});

// Email index for faster queries
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ subscribedAt: -1 });

// Instance method to unsubscribe
newsletterSchema.methods.unsubscribe = function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

// Static method to find active subscribers
newsletterSchema.statics.findActiveSubscribers = function() {
  return this.find({ isActive: true }).sort({ subscribedAt: -1 });
};

// Static method to get subscription stats
newsletterSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalSubscribers: { $sum: 1 },
        activeSubscribers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        unsubscribed: {
          $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Newsletter', newsletterSchema); 