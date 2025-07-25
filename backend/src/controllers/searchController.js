const User = require('../models/User');
const Blog = require('../models/Blog');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');

// Global arama fonksiyonu
exports.globalSearch = async (req, res) => {
  try {
    const { query, type, category, dateRange, sortBy, limit = 10 } = req.query;
    const userId = req.userId;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Arama terimi en az 2 karakter olmalıdır.' 
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const results = [];

    // Date range filter
    let dateFilter = {};
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      switch (dateRange) {
        case '1w':
          dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
          break;
        case '1m':
          dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
          break;
        case '3m':
          dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
          break;
        case '6m':
          dateFilter = { createdAt: { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) } };
          break;
      }
    }

    // Blog arama
    if (!type || type === 'blog') {
      const blogQuery = {
        $and: [
          {
            $or: [
              { title: searchRegex },
              { content: searchRegex },
              { excerpt: searchRegex },
              { tags: { $in: [searchRegex] } }
            ]
          },
          { status: 'published' },
          dateFilter
        ]
      };

      if (category && category !== 'all') {
        blogQuery.$and.push({ category });
      }

      const blogs = await Blog.find(blogQuery)
        .populate('author', 'name')
        .limit(parseInt(limit))
        .select('title excerpt author category tags createdAt views likes')
        .sort(sortBy === 'newest' ? { createdAt: -1 } : 
              sortBy === 'oldest' ? { createdAt: 1 } :
              sortBy === 'popular' ? { views: -1, likes: -1 } : 
              { createdAt: -1 });

      blogs.forEach(blog => {
        results.push({
          id: blog._id,
          type: 'blog',
          title: blog.title,
          excerpt: blog.excerpt,
          author: blog.author?.name,
          category: blog.category,
          tags: blog.tags,
          date: blog.createdAt,
          stats: { views: blog.views, likes: blog.likes }
        });
      });
    }

    // Workout arama
    if (!type || type === 'workout') {
      const workoutQuery = {
        $and: [
          {
            $or: [
              { name: searchRegex },
              { description: searchRegex },
              { type: searchRegex },
              { 'exercises.name': searchRegex }
            ]
          },
          { userId },
          dateFilter
        ]
      };

      const workouts = await Workout.find(workoutQuery)
        .limit(parseInt(limit))
        .select('name description type difficultyLevel estimatedTime caloriesBurn createdAt')
        .sort(sortBy === 'newest' ? { createdAt: -1 } : 
              sortBy === 'oldest' ? { createdAt: 1 } : 
              { createdAt: -1 });

      workouts.forEach(workout => {
        results.push({
          id: workout._id,
          type: 'workout',
          title: workout.name,
          excerpt: workout.description,
          category: workout.type,
          difficulty: workout.difficultyLevel,
          date: workout.createdAt,
          stats: { 
            duration: workout.estimatedTime, 
            calories: workout.caloriesBurn 
          }
        });
      });
    }

    // Nutrition arama
    if (!type || type === 'nutrition') {
      const nutritionQuery = {
        $and: [
          {
            $or: [
              { 'foods.name': searchRegex },
              { notes: searchRegex }
            ]
          },
          { userId },
          dateFilter
        ]
      };

      const nutritions = await Nutrition.find(nutritionQuery)
        .limit(parseInt(limit))
        .select('date foods totalCalories totalProtein totalCarbs totalFat notes createdAt')
        .sort(sortBy === 'newest' ? { date: -1 } : 
              sortBy === 'oldest' ? { date: 1 } : 
              { date: -1 });

      nutritions.forEach(nutrition => {
        results.push({
          id: nutrition._id,
          type: 'nutrition',
          title: `Beslenme - ${nutrition.date.toLocaleDateString('tr-TR')}`,
          excerpt: nutrition.notes || `${nutrition.foods?.length || 0} yemek kaydı`,
          date: nutrition.date,
          stats: { 
            calories: nutrition.totalCalories,
            foods: nutrition.foods?.length || 0
          }
        });
      });
    }

    // Kullanıcı arama (sadece adminler için)
    if ((!type || type === 'user') && req.user?.role === 'admin') {
      const userQuery = {
        $and: [
          {
            $or: [
              { name: searchRegex },
              { email: searchRegex }
            ]
          },
          dateFilter
        ]
      };

      const users = await User.find(userQuery)
        .limit(parseInt(limit))
        .select('name email role isActive lastLogin createdAt')
        .sort(sortBy === 'newest' ? { createdAt: -1 } : 
              sortBy === 'oldest' ? { createdAt: 1 } : 
              { lastLogin: -1 });

      users.forEach(user => {
        results.push({
          id: user._id,
          type: 'user',
          title: user.name,
          excerpt: user.email,
          category: user.role,
          date: user.createdAt,
          stats: { 
            status: user.isActive ? 'Aktif' : 'Pasif',
            lastLogin: user.lastLogin
          }
        });
      });
    }

    // Sonuçları sırala
    if (sortBy === 'relevance') {
      results.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, query);
        const bScore = calculateRelevanceScore(b, query);
        return bScore - aScore;
      });
    }

    res.json({
      query,
      results: results.slice(0, parseInt(limit)),
      total: results.length,
      filters: { type, category, dateRange, sortBy }
    });

  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({ 
      message: 'Arama işlemi sırasında bir hata oluştu.' 
    });
  }
};

// Arama önerileri
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.userId;

    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchRegex = new RegExp(query, 'i');
    const suggestions = [];

    // Blog başlıkları
    const blogTitles = await Blog.find(
      { title: searchRegex, status: 'published' },
      { title: 1 }
    ).limit(5);
    
    blogTitles.forEach(blog => {
      suggestions.push({
        text: blog.title,
        type: 'blog'
      });
    });

    // Workout isimleri
    const workoutNames = await Workout.find(
      { name: searchRegex, userId },
      { name: 1 }
    ).limit(5);
    
    workoutNames.forEach(workout => {
      suggestions.push({
        text: workout.name,
        type: 'workout'
      });
    });

    // En popüler aramalar (hardcoded for now)
    const popularSearches = [
      'antrenman', 'beslenme', 'kilo verme', 'kas kazanma', 
      'protein', 'karbonhidrat', 'cardio', 'strength'
    ];

    popularSearches
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .forEach(term => {
        suggestions.push({
          text: term,
          type: 'popular'
        });
      });

    res.json({
      suggestions: suggestions.slice(0, 10)
    });

  } catch (error) {
    console.error('Öneri hatası:', error);
    res.status(500).json({ 
      message: 'Öneriler alınırken bir hata oluştu.' 
    });
  }
};

// Relevance score hesaplama
function calculateRelevanceScore(item, query) {
  let score = 0;
  const queryLower = query.toLowerCase();
  const titleLower = item.title.toLowerCase();
  const excerptLower = (item.excerpt || '').toLowerCase();

  // Başlıkta tam eşleşme
  if (titleLower === queryLower) score += 100;
  // Başlık query ile başlıyor
  else if (titleLower.startsWith(queryLower)) score += 80;
  // Başlıkta query var
  else if (titleLower.includes(queryLower)) score += 60;

  // Excerpt'te eşleşme
  if (excerptLower.includes(queryLower)) score += 20;

  // Tür bonusu
  if (item.type === 'blog') score += 10;
  if (item.type === 'workout') score += 15;

  // Popülerlik bonusu
  if (item.stats?.views > 100) score += 5;
  if (item.stats?.likes > 10) score += 5;

  return score;
}

module.exports = exports; 