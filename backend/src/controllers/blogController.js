const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all blogs (public) - with pagination and filtering
exports.getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      search,
      status = 'published'
    } = req.query;

    let query = {};

    // Status filter (only admins can see drafts)
    if (req.admin) {
      if (status) query.status = status;
    } else {
      query.status = 'published';
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Tags filter
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    let blogs;

    // Search functionality
    if (search) {
      blogs = await Blog.search(search);
    } else {
      blogs = await Blog.find(query)
        .populate('author', 'name email profileImage')
        .sort({ isSticky: -1, publishedAt: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Blog yazıları alınırken hata oluştu.'
    });
  }
};

// Get single blog by ID (Admin only)
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate('author', 'name email profileImage');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı.'
      });
    }

    res.json({
      success: true,
      blog
    });

  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Blog yazısı alınırken hata oluştu.'
    });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug })
      .populate('author', 'name email profileImage');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı.'
      });
    }

    // Only published blogs for non-admins
    if (!req.admin && blog.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı.'
      });
    }

    // Increment views for published blogs
    if (blog.status === 'published') {
      await blog.incrementViews();
    }

    res.json({
      success: true,
      blog
    });

  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Blog yazısı alınırken hata oluştu.'
    });
  }
};

// Create new blog (Admin only)
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status,
      isSticky,
      seo,
      scheduledFor
    } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Başlık ve içerik gereklidir.'
      });
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      featuredImage,
      author: req.user._id,
      status: status || 'draft',
      isSticky: isSticky || false,
      seo: seo || {},
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
    });

    // Slug oluştur
    blog.generateSlug();

    await blog.save();

    // Populate author info
    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog yazısı başarıyla oluşturuldu! 🎉',
      blog
    });

  } catch (error) {
    console.error('Create blog error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu başlıkta bir yazı zaten mevcut. Lütfen farklı bir başlık deneyin.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Blog yazısı oluşturulurken hata oluştu.'
    });
  }
};

// Update blog (Admin only)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı.'
      });
    }

    // Tags handling
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        blog[key] = updates[key];
      }
    });

    await blog.save();

    // Populate author info
    await blog.populate('author', 'name email');

    res.json({
      success: true,
      message: 'Blog yazısı başarıyla güncellendi! ✅',
      blog
    });

  } catch (error) {
    console.error('Update blog error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu başlıkta bir yazı zaten mevcut.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Blog yazısı güncellenirken hata oluştu.'
    });
  }
};

// Delete blog (Admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı.'
      });
    }

    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog yazısı başarıyla silindi! 🗑️'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Blog yazısı silinirken hata oluştu.'
    });
  }
};

// Publish blog (Admin only)
exports.publishBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı.'
      });
    }

    await blog.publish();
    await blog.populate('author', 'name email');

    res.json({
      success: true,
      message: 'Blog yazısı başarıyla yayınlandı! 🚀',
      blog
    });

  } catch (error) {
    console.error('Publish blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Blog yazısı yayınlanırken hata oluştu.'
    });
  }
};

// Get blog stats (Admin only)
exports.getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    const archivedBlogs = await Blog.countDocuments({ status: 'archived' });

    const totalViews = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const totalLikes = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    const categoryStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const popularBlogs = await Blog.getPopular(5);

    res.json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0
      },
      categoryStats,
      recentBlogs,
      popularBlogs
    });

  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Blog istatistikleri alınırken hata oluştu.'
    });
  }
};

// Get categories (Public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    
    const categoryStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories: categoryStats
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriler alınırken hata oluştu.'
    });
  }
};

// Get popular tags (Public)
exports.getPopularTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      tags
    });

  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Popüler etiketler alınırken hata oluştu.'
    });
  }
}; 