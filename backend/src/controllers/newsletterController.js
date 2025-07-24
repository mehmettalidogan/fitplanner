const Newsletter = require('../models/Newsletter');

// Newsletter subscription
exports.subscribe = async (req, res) => {
  try {
    const { email, name, source = 'blog', preferences } = req.body;

    // Email validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi gereklidir.'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Bu email adresi zaten abone listesinde bulunuyor.'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        existingSubscriber.source = source;
        
        if (name) existingSubscriber.name = name;
        if (preferences) existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };

        await existingSubscriber.save();

        return res.json({
          success: true,
          message: 'Aboneliğiniz başarıyla yeniden aktifleştirildi! 🎉',
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            subscribedAt: existingSubscriber.subscribedAt
          }
        });
      }
    }

    // Create new subscription
    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer')
    };

    const newSubscriber = new Newsletter({
      email: email.toLowerCase(),
      name,
      source,
      preferences: preferences || {},
      metadata
    });

    await newSubscriber.save();

    // Success response
    res.status(201).json({
      success: true,
      message: 'Başarıyla abone oldunuz! Hoş geldiniz! 🎉',
      subscriber: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        subscribedAt: newSubscriber.subscribedAt,
        preferences: newSubscriber.preferences
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten abone listesinde bulunuyor.'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Abonelik işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.'
    });
  }
};

// Unsubscribe
exports.unsubscribe = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi gereklidir.'
      });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Bu email adresi abone listesinde bulunamadı.'
      });
    }

    if (!subscriber.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten abonelik listesinden çıkarılmış.'
      });
    }

    await subscriber.unsubscribe();

    res.json({
      success: true,
      message: 'Abonelikten başarıyla çıkarıldınız. Sizi özleyeceğiz! 😢'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Abonelik iptali sırasında bir hata oluştu.'
    });
  }
};

// Get subscriber info
exports.getSubscriber = async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscriber = await Newsletter.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('-metadata');

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Abone bulunamadı.'
      });
    }

    res.json({
      success: true,
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        subscribedAt: subscriber.subscribedAt,
        preferences: subscriber.preferences,
        source: subscriber.source
      }
    });

  } catch (error) {
    console.error('Get subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Abone bilgileri alınırken hata oluştu.'
    });
  }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { email } = req.params;
    const { preferences, name } = req.body;

    const subscriber = await Newsletter.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Aktif abone bulunamadı.'
      });
    }

    if (preferences) {
      subscriber.preferences = { ...subscriber.preferences, ...preferences };
    }
    
    if (name !== undefined) {
      subscriber.name = name;
    }

    await subscriber.save();

    res.json({
      success: true,
      message: 'Tercihleriniz başarıyla güncellendi! ✅',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        preferences: subscriber.preferences
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Tercihler güncellenirken hata oluştu.'
    });
  }
};

// Get newsletter stats (admin only)
exports.getStats = async (req, res) => {
  try {
    const stats = await Newsletter.getStats();
    const recentSubscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(10)
      .select('email name subscribedAt source');

    const sourceStats = await Newsletter.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalSubscribers: 0, activeSubscribers: 0, unsubscribed: 0 },
      recentSubscribers,
      sourceStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler alınırken hata oluştu.'
    });
  }
};

// Get all active subscribers (admin only)
exports.getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-metadata');

    const total = await Newsletter.countDocuments({ isActive: true });

    res.json({
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Abone listesi alınırken hata oluştu.'
    });
  }
}; 