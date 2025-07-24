const User = require('../models/User');
const Blog = require('../models/Blog');
const Newsletter = require('../models/Newsletter');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');

// Admin Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    // Blog statistics
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    const totalBlogViews = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    // Newsletter statistics
    const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
    const newSubscribersThisMonth = await Newsletter.countDocuments({
      subscribedAt: { $gte: new Date(new Date().setDate(1)) },
      isActive: true
    });

    // Workout & Nutrition statistics
    const totalWorkouts = await Workout.countDocuments();
    const totalNutrition = await Nutrition.countDocuments();

    // Recent activities
    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt author views');

    const recentSubscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(5)
      .select('email name subscribedAt source');

    // Growth data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        timestamp: new Date(date.setHours(0, 0, 0, 0))
      };
    }).reverse();

    const userGrowth = await Promise.all(
      last7Days.map(async (day) => {
        const count = await User.countDocuments({
          createdAt: {
            $gte: day.timestamp,
            $lt: new Date(day.timestamp.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        return { date: day.date, count };
      })
    );

    const subscriberGrowth = await Promise.all(
      last7Days.map(async (day) => {
        const count = await Newsletter.countDocuments({
          subscribedAt: {
            $gte: day.timestamp,
            $lt: new Date(day.timestamp.getTime() + 24 * 60 * 60 * 1000)
          },
          isActive: true
        });
        return { date: day.date, count };
      })
    );

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
          growth: userGrowth
        },
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
          drafts: draftBlogs,
          totalViews: totalBlogViews[0]?.total || 0
        },
        newsletter: {
          totalSubscribers,
          newThisMonth: newSubscribersThisMonth,
          growth: subscriberGrowth
        },
        content: {
          workouts: totalWorkouts,
          nutrition: totalNutrition
        }
      },
      recentActivity: {
        users: recentUsers,
        blogs: recentBlogs,
        subscribers: recentSubscribers
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard istatistikleri alınırken hata oluştu.'
    });
  }
};

// User Management - Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role) {
      query.role = role;
    }

    // Active status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    // User statistics by role
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Activity statistics
    const activeStats = await User.aggregate([
      { $group: { _id: '$isActive', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        byRole: roleStats,
        byActivity: activeStats
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı listesi alınırken hata oluştu.'
    });
  }
};

// Get single user details
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    // Get user's blogs if any
    const userBlogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status createdAt views likes');

    // Get user's newsletter subscription
    const newsletterSub = await Newsletter.findOne({ 
      email: user.email, 
      isActive: true 
    });

    res.json({
      success: true,
      user,
      userBlogs,
      newsletterSubscription: newsletterSub
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı detayları alınırken hata oluştu.'
    });
  }
};

// Update user (Admin can update any user)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(userId).select('-password');

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla güncellendi! ✅',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı güncellenirken hata oluştu.'
    });
  }
};

// Deactivate/Activate user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Kendi hesabınızı deaktif edemezsiniz.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `Kullanıcı başarıyla ${user.isActive ? 'aktif' : 'deaktif'} edildi! ${user.isActive ? '✅' : '❌'}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı durumu değiştirilirken hata oluştu.'
    });
  }
};

// Delete user (soft delete - deactivate)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Kendi hesabınızı silemezsiniz.'
      });
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    // Also deactivate newsletter subscription if exists
    await Newsletter.updateOne(
      { email: user.email },
      { $set: { isActive: false, unsubscribedAt: new Date() } }
    );

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi! 🗑️'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı silinirken hata oluştu.'
    });
  }
};

// Get system health and info
exports.getSystemInfo = async (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      systemInfo
    });

  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({
      success: false,
      message: 'Sistem bilgileri alınırken hata oluştu.'
    });
  }
}; 