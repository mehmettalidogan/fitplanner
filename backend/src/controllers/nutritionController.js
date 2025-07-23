const Nutrition = require('../models/Nutrition');

// Toplam makroları hesapla
const calculateTotalMacros = (meals) => {
  return meals.reduce((totals, meal) => {
    meal.foods.forEach(food => {
      totals.totalProtein += (food.protein || 0);
      totals.totalCarbs += (food.carbs || 0);
      totals.totalFat += (food.fat || 0);
      totals.totalCalories += (food.calories || 0);
    });
    return totals;
  }, { totalProtein: 0, totalCarbs: 0, totalFat: 0, totalCalories: 0 });
};

// Yeni beslenme kaydı oluştur
exports.createNutrition = async (req, res) => {
  try {
    const nutritionData = {
      ...req.body,
      userId: req.user._id
    };

    // Toplam makroları hesapla
    const totals = calculateTotalMacros(nutritionData.meals);
    nutritionData.totalProtein = totals.totalProtein;
    nutritionData.totalCarbs = totals.totalCarbs;
    nutritionData.totalFat = totals.totalFat;
    nutritionData.totalCalories = totals.totalCalories;

    const nutrition = new Nutrition(nutritionData);
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Kullanıcının beslenme kayıtlarını getir
exports.getNutritions = async (req, res) => {
  try {
    const nutritions = await Nutrition.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(nutritions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir beslenme kaydını getir
exports.getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!nutrition) {
      return res.status(404).json({ message: 'Beslenme kaydı bulunamadı' });
    }
    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Beslenme kaydını güncelle
exports.updateNutrition = async (req, res) => {
  try {
    const nutritionData = { ...req.body };
    
    // Eğer öğünler güncellendiyse, toplam makroları yeniden hesapla
    if (nutritionData.meals) {
      const totals = calculateTotalMacros(nutritionData.meals);
      nutritionData.totalProtein = totals.totalProtein;
      nutritionData.totalCarbs = totals.totalCarbs;
      nutritionData.totalFat = totals.totalFat;
      nutritionData.totalCalories = totals.totalCalories;
    }

    const nutrition = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      nutritionData,
      { new: true }
    );
    
    if (!nutrition) {
      return res.status(404).json({ message: 'Beslenme kaydı bulunamadı' });
    }
    res.json(nutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Beslenme kaydını sil
exports.deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!nutrition) {
      return res.status(404).json({ message: 'Beslenme kaydı bulunamadı' });
    }
    res.json({ message: 'Beslenme kaydı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Günlük makro toplamlarını getir
exports.getDailyMacros = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyNutritions = await Nutrition.find({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Tüm günlük kayıtların makrolarını topla
    const totals = dailyNutritions.reduce((acc, nutrition) => {
      acc.totalProtein += (nutrition.totalProtein || 0);
      acc.totalCarbs += (nutrition.totalCarbs || 0);
      acc.totalFat += (nutrition.totalFat || 0);
      return acc;
    }, { totalProtein: 0, totalCarbs: 0, totalFat: 0 });

    res.json(totals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Haftalık makro verilerini getir
exports.getWeeklyMacros = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyNutritions = await Nutrition.find({
      userId: req.user._id,
      date: {
        $gte: weekAgo,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const weeklyData = [];
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    // Her gün için makroları topla
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayNutritions = weeklyNutritions.filter(n => {
        const nutritionDate = new Date(n.date);
        return nutritionDate.getDate() === date.getDate() &&
               nutritionDate.getMonth() === date.getMonth() &&
               nutritionDate.getFullYear() === date.getFullYear();
      });

      // Günlük toplam makroları hesapla
      const dayTotals = dayNutritions.reduce((acc, nutrition) => {
        acc.protein += (nutrition.totalProtein || 0);
        acc.carbs += (nutrition.totalCarbs || 0);
        acc.fat += (nutrition.totalFat || 0);
        return acc;
      }, { protein: 0, carbs: 0, fat: 0 });

      weeklyData.unshift({
        day: days[date.getDay()],
        ...dayTotals
      });
    }

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 