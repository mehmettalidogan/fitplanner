const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login_success',
      'login_failed',
      'password_change',
      'email_change',
      'profile_update',
      'logout',
      'account_locked',
      'password_reset_request',
      'password_reset_success',
      'email_verification_sent',
      'email_verified',
      '2fa_enabled',
      '2fa_disabled',
      '2fa_backup_code_used',
      'suspicious_activity',
      'account_created'
    ]
  },
  details: {
    type: String,
    maxlength: 500
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    maxlength: 1000
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'blocked', 'pending'],
    default: 'success'
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
securityLogSchema.index({ userId: 1, createdAt: -1 });
securityLogSchema.index({ action: 1, createdAt: -1 });
securityLogSchema.index({ severity: 1, createdAt: -1 });
securityLogSchema.index({ ipAddress: 1 });

// Clean up old logs (keep only last 90 days)
securityLogSchema.statics.cleanupOldLogs = async function() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return this.deleteMany({ createdAt: { $lt: ninetyDaysAgo } });
};

// Get security summary for user
securityLogSchema.statics.getSecuritySummary = async function(userId) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const [totalLogs, recentLogs, loginStats, securityEvents] = await Promise.all([
    this.countDocuments({ userId }),
    this.countDocuments({ userId, createdAt: { $gte: thirtyDaysAgo } }),
    this.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), action: { $in: ['login_success', 'login_failed'] } } },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), severity: { $in: ['medium', 'high', 'critical'] } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ])
  ]);

  return {
    totalLogs,
    recentLogs,
    loginStats: loginStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {}),
    securityEvents: securityEvents.reduce((acc, event) => {
      acc[event._id] = event.count;
      return acc;
    }, {})
  };
};

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

module.exports = SecurityLog; 