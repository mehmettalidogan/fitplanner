const User = require('../models/User');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const WeightEntry = require('../models/WeightEntry');
const SecurityLog = require('../models/SecurityLog');

// Genel analytics özeti
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '1m' } = req.query;

    const now = new Date();
    let dateFilter = {};
    
    switch (period) {
      case '1m':
        dateFilter = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '3m':
        dateFilter = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
        break;
      case '6m':
        dateFilter = { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) };
        break;
      case '1y':
        dateFilter = { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    // Paralel olarak tüm verileri çek
    const [workoutStats, nutritionStats, weightStats, activityStats] = await Promise.all([
      getWorkoutAnalytics(userId, dateFilter),
      getNutritionAnalytics(userId, dateFilter),
      WeightEntry.getWeightStats(userId, period),
      getActivityAnalytics(userId, dateFilter)
    ]);

    res.json({
      period,
      summary: {
        workouts: workoutStats.summary,
        nutrition: nutritionStats.summary,
        weight: weightStats.stats,
        activity: activityStats
      },
      charts: {
        workoutProgress: workoutStats.chartData,
        nutritionProgress: nutritionStats.chartData,
        weightProgress: weightStats.entries.map(entry => ({
          date: entry.date,
          weight: entry.weight,
          bodyFat: entry.bodyFat,
          muscleMass: entry.muscleMass
        }))
      }
    });

  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ message: 'Analytics özeti alınırken hata oluştu.' });
  }
};

// Detaylı workout analytics
exports.getWorkoutAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '1m' } = req.query;

    const dateFilter = getDateFilter(period);
    const analytics = await getWorkoutAnalytics(userId, dateFilter);

    res.json(analytics);

  } catch (error) {
    console.error('Workout analytics error:', error);
    res.status(500).json({ message: 'Antrenman analytics alınırken hata oluştu.' });
  }
};

// Detaylı nutrition analytics
exports.getNutritionAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '1m' } = req.query;

    const dateFilter = getDateFilter(period);
    const analytics = await getNutritionAnalytics(userId, dateFilter);

    res.json(analytics);

  } catch (error) {
    console.error('Nutrition analytics error:', error);
    res.status(500).json({ message: 'Beslenme analytics alınırken hata oluştu.' });
  }
};

// Progress tracking
exports.getProgressReport = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Son 3 ayın verilerini al
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    
    const [workouts, nutrition, weightEntries] = await Promise.all([
      Workout.find({ userId, createdAt: { $gte: threeMonthsAgo } }).sort({ createdAt: 1 }),
      Nutrition.find({ userId, date: { $gte: threeMonthsAgo } }).sort({ date: 1 }),
      WeightEntry.find({ userId, date: { $gte: threeMonthsAgo } }).sort({ date: 1 })
    ]);

    // Haftalık progress hesapla
    const weeklyProgress = calculateWeeklyProgress(workouts, nutrition, weightEntries);

    // Hedef progress
    const goalProgress = calculateGoalProgress(user, workouts, nutrition, weightEntries);

    res.json({
      user: {
        name: user.name,
        goal: user.goal,
        startDate: user.createdAt
      },
      weeklyProgress,
      goalProgress,
      recommendations: generateRecommendations(user, goalProgress)
    });

  } catch (error) {
    console.error('Progress report error:', error);
    res.status(500).json({ message: 'Progress raporu alınırken hata oluştu.' });
  }
};

// Helper functions
function getDateFilter(period) {
  const now = new Date();
  switch (period) {
    case '1m':
      return { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
    case '3m':
      return { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
    case '6m':
      return { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) };
    case '1y':
      return { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) };
    default:
      return {};
  }
}

async function getWorkoutAnalytics(userId, dateFilter) {
  const workouts = await Workout.find({ 
    userId, 
    createdAt: dateFilter 
  }).sort({ createdAt: 1 });

  const totalWorkouts = workouts.length;
  const totalTime = workouts.reduce((sum, w) => sum + (w.estimatedTime || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurn || 0), 0);

  // Workout türlerine göre dağılım
  const typeDistribution = workouts.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + 1;
    return acc;
  }, {});

  // Haftalık chart data
  const chartData = groupByWeek(workouts).map(week => ({
    week: week.date,
    workouts: week.count,
    totalTime: week.totalTime,
    avgCalories: week.avgCalories
  }));

  return {
    summary: {
      totalWorkouts,
      totalTime,
      avgTime: totalWorkouts > 0 ? Math.round(totalTime / totalWorkouts) : 0,
      totalCalories,
      avgCalories: totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0,
      typeDistribution
    },
    chartData
  };
}

async function getNutritionAnalytics(userId, dateFilter) {
  const nutrition = await Nutrition.find({ 
    userId, 
    date: dateFilter 
  }).sort({ date: 1 });

  const totalDays = nutrition.length;
  const totalCalories = nutrition.reduce((sum, n) => sum + (n.totalCalories || 0), 0);
  const totalProtein = nutrition.reduce((sum, n) => sum + (n.totalProtein || 0), 0);
  const totalCarbs = nutrition.reduce((sum, n) => sum + (n.totalCarbs || 0), 0);
  const totalFat = nutrition.reduce((sum, n) => sum + (n.totalFat || 0), 0);

  // Haftalık chart data
  const chartData = groupNutritionByWeek(nutrition).map(week => ({
    week: week.date,
    avgCalories: week.avgCalories,
    avgProtein: week.avgProtein,
    avgCarbs: week.avgCarbs,
    avgFat: week.avgFat
  }));

  return {
    summary: {
      totalDays,
      avgCalories: totalDays > 0 ? Math.round(totalCalories / totalDays) : 0,
      avgProtein: totalDays > 0 ? Math.round(totalProtein / totalDays) : 0,
      avgCarbs: totalDays > 0 ? Math.round(totalCarbs / totalDays) : 0,
      avgFat: totalDays > 0 ? Math.round(totalFat / totalDays) : 0,
      macroDistribution: {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      }
    },
    chartData
  };
}

async function getActivityAnalytics(userId, dateFilter) {
  const loginLogs = await SecurityLog.find({
    userId,
    action: 'login_success',
    createdAt: dateFilter
  });

  const activeDays = new Set(loginLogs.map(log => 
    log.createdAt.toISOString().split('T')[0]
  )).size;

  return {
    activeDays,
    totalLogins: loginLogs.length,
    avgLoginsPerDay: activeDays > 0 ? Math.round(loginLogs.length / activeDays * 10) / 10 : 0
  };
}

function groupByWeek(items) {
  const weeks = {};
  
  items.forEach(item => {
    const date = new Date(item.createdAt || item.date);
    const weekStart = new Date(date - date.getDay() * 24 * 60 * 60 * 1000);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        date: weekKey,
        count: 0,
        totalTime: 0,
        totalCalories: 0
      };
    }
    
    weeks[weekKey].count++;
    weeks[weekKey].totalTime += item.estimatedTime || 0;
    weeks[weekKey].totalCalories += item.caloriesBurn || 0;
  });

  return Object.values(weeks).map(week => ({
    ...week,
    avgCalories: week.count > 0 ? Math.round(week.totalCalories / week.count) : 0
  }));
}

function groupNutritionByWeek(items) {
  const weeks = {};
  
  items.forEach(item => {
    const date = new Date(item.date);
    const weekStart = new Date(date - date.getDay() * 24 * 60 * 60 * 1000);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        date: weekKey,
        days: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0
      };
    }
    
    weeks[weekKey].days++;
    weeks[weekKey].totalCalories += item.totalCalories || 0;
    weeks[weekKey].totalProtein += item.totalProtein || 0;
    weeks[weekKey].totalCarbs += item.totalCarbs || 0;
    weeks[weekKey].totalFat += item.totalFat || 0;
  });

  return Object.values(weeks).map(week => ({
    date: week.date,
    avgCalories: week.days > 0 ? Math.round(week.totalCalories / week.days) : 0,
    avgProtein: week.days > 0 ? Math.round(week.totalProtein / week.days) : 0,
    avgCarbs: week.days > 0 ? Math.round(week.totalCarbs / week.days) : 0,
    avgFat: week.days > 0 ? Math.round(week.totalFat / week.days) : 0
  }));
}

function calculateWeeklyProgress(workouts, nutrition, weightEntries) {
  // Bu fonksiyon haftalık progress hesaplayacak
  return {
    workoutFrequency: 85, // %
    calorieConsistency: 78,
    weightProgress: 92
  };
}

function calculateGoalProgress(user, workouts, nutrition, weightEntries) {
  // Bu fonksiyon kullanıcının hedefine göre progress hesaplayacak
  return {
    overall: 82, // %
    fitness: 88,
    nutrition: 75,
    weightGoal: 85
  };
}

function generateRecommendations(user, goalProgress) {
  const recommendations = [];
  
  if (goalProgress.nutrition < 80) {
    recommendations.push({
      type: 'nutrition',
      message: 'Beslenme tutarlılığınızı artırın',
      priority: 'high'
    });
  }
  
  if (goalProgress.fitness < 85) {
    recommendations.push({
      type: 'workout',
      message: 'Antrenman sıklığınızı artırın',
      priority: 'medium'
    });
  }

  return recommendations;
}

module.exports = exports; 