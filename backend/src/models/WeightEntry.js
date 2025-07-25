const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 500
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  bodyFat: {
    type: Number,
    min: 0,
    max: 100
  },
  muscleMass: {
    type: Number,
    min: 0,
    max: 200
  }
}, {
  timestamps: true
});

// Indexes
weightEntrySchema.index({ userId: 1, date: -1 });
weightEntrySchema.index({ userId: 1, createdAt: -1 });

// Prevent duplicate entries for same user on same date
weightEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Static methods
weightEntrySchema.statics.getWeightStats = async function(userId, period = 'all') {
  const now = new Date();
  let dateFilter = {};
  
  switch (period) {
    case '1m':
      dateFilter = { date: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
      break;
    case '3m':
      dateFilter = { date: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
      break;
    case '6m':
      dateFilter = { date: { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) } };
      break;
    case '1y':
      dateFilter = { date: { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) } };
      break;
  }

  const entries = await this.find({ userId, ...dateFilter }).sort({ date: 1 });
  
  if (entries.length === 0) {
    return { entries: [], stats: null };
  }

  const weights = entries.map(e => e.weight);
  const currentWeight = weights[weights.length - 1];
  const startWeight = weights[0];
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);
  const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
  const weightChange = currentWeight - startWeight;

  return {
    entries,
    stats: {
      current: currentWeight,
      start: startWeight,
      max: maxWeight,
      min: minWeight,
      average: Math.round(avgWeight * 10) / 10,
      change: Math.round(weightChange * 10) / 10,
      trend: weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : 'stable'
    }
  };
};

const WeightEntry = mongoose.model('WeightEntry', weightEntrySchema);

module.exports = WeightEntry; 