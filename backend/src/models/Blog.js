const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  category: {
    type: String,
    enum: ['antrenman', 'beslenme', 'motivasyon', 'saglik', 'yasamtarzi', 'genel'],
    default: 'genel'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    type: String,
    default: '/img/blog-default.jpg'
  },
  readingTime: {
    type: Number, // dakika cinsinden
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    metaKeywords: [{
      type: String,
      trim: true
    }]
  },
  publishedAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  }
}, {
  timestamps: true, // createdAt ve updatedAt otomatik
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ views: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', content: 'text' }); // Text search

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Virtual for formatted publish date
blogSchema.virtual('publishDate').get(function() {
  const date = this.publishedAt || this.createdAt;
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to calculate reading time (ortalama 200 kelime/dakika)
blogSchema.methods.calculateReadingTime = function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  return this.readingTime;
};

// Method to generate slug from title
blogSchema.methods.generateSlug = function() {
  let slug = this.title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  this.slug = slug;
  return slug;
};

// Method to publish blog
blogSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

// Method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Pre-save middleware
blogSchema.pre('save', async function(next) {
  try {
    // Auto-generate slug if not provided
    if (!this.slug || this.isModified('title')) {
      let baseSlug = this.generateSlug();
      let slug = baseSlug;
      let counter = 1;
      
      // Benzersiz slug oluştur
      while (true) {
        const existingBlog = await mongoose.model('Blog').findOne({ slug, _id: { $ne: this._id } });
        if (!existingBlog) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      this.slug = slug;
    }
    
    // Auto-calculate reading time
    if (this.isModified('content')) {
      this.calculateReadingTime();
    }
    
    // Auto-generate excerpt from content if not provided
    if (!this.excerpt && this.content) {
      this.excerpt = this.content
        .replace(/<[^>]*>/g, '') // HTML tagları kaldır
        .substring(0, 150) + '...';
    }
    
    // SEO optimizations
    if (!this.seo.metaTitle) {
      this.seo.metaTitle = this.title.substring(0, 60);
    }
    
    if (!this.seo.metaDescription) {
      this.seo.metaDescription = this.excerpt;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static methods
blogSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .populate('author', 'name email')
    .sort({ publishedAt: -1 });
};

blogSchema.statics.findByCategory = function(category) {
  return this.find({ 
    status: 'published', 
    category: category 
  })
    .populate('author', 'name email')
    .sort({ publishedAt: -1 });
};

blogSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'published'
  })
    .populate('author', 'name email')
    .sort({ score: { $meta: 'textScore' } });
};

blogSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .populate('author', 'name email')
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

blogSchema.statics.getRecent = function(limit = 10) {
  return this.find({ status: 'published' })
    .populate('author', 'name email')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Blog', blogSchema); 