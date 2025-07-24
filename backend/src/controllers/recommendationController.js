const Recommendation = require('../models/Recommendation');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');

exports.updatePreferences = async (req, res) => {
  try {
    const { fitnessLevel, workoutPreferences, dietaryRestrictions, goals } = req.body;
    const userId = req.user.userId;

    let recommendation = await Recommendation.findOne({ userId });

    if (!recommendation) {
      recommendation = new Recommendation({ userId });
    }

    recommendation.preferences = {
      fitnessLevel,
      workoutPreferences,
      dietaryRestrictions,
      goals
    };

    const recommendations = await generateRecommendations(userId, {
      fitnessLevel,
      workoutPreferences,
      dietaryRestrictions,
      goals
    });

    recommendation.recommendedWorkouts = recommendations.workouts;
    recommendation.recommendedNutrition = recommendations.nutrition;
    recommendation.lastUpdated = new Date();

    await recommendation.save();

    // Populate the recommendations before sending
    await recommendation.populate([
      { path: 'recommendedWorkouts' },
      { path: 'recommendedNutrition' }
    ]);

    res.json({
      recommendedWorkouts: recommendation.recommendedWorkouts,
      recommendedNutrition: recommendation.recommendedNutrition
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Tercihler güncellenirken bir hata oluştu.' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recommendation = await Recommendation.findOne({ userId }).populate([
      { path: 'recommendedWorkouts' },
      { path: 'recommendedNutrition' }
    ]);

    if (!recommendation) {
      return res.status(404).json({ message: 'Öneri bulunamadı. Lütfen tercihlerinizi güncelleyin.' });
    }

    res.json({
      recommendedWorkouts: recommendation.recommendedWorkouts,
      recommendedNutrition: recommendation.recommendedNutrition
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Öneriler alınırken bir hata oluştu.' });
  }
};

async function generateRecommendations(userId, preferences) {
  try {
    const workouts = await calculateWorkoutRecommendations(preferences);
    const nutrition = await calculateNutritionRecommendations(preferences);

    return {
      workouts,
      nutrition
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
}

async function calculateWorkoutRecommendations(preferences) {
  try {
    // İlk olarak tam eşleşen antrenmanları bul
    let workouts = await Workout.find({
      difficultyLevel: preferences.fitnessLevel,
      type: { $in: preferences.workoutPreferences },
      targetGoals: { $in: preferences.goals }
    }).limit(3);

    // Eğer yeterli antrenman bulunamazsa, kriterleri genişlet
    if (workouts.length < 3) {
      const additionalWorkouts = await Workout.find({
        $or: [
          { difficultyLevel: preferences.fitnessLevel },
          { type: { $in: preferences.workoutPreferences } },
          { targetGoals: { $in: preferences.goals } }
        ],
        _id: { $nin: workouts.map(w => w._id) }
      }).limit(3 - workouts.length);

      workouts = [...workouts, ...additionalWorkouts];
    }

    // Hala yeterli antrenman bulunamazsa, varsayılan zorluk seviyesine göre getir
    if (workouts.length < 3) {
      const defaultWorkouts = await Workout.find({
        difficultyLevel: 'beginner',
        _id: { $nin: workouts.map(w => w._id) }
      }).limit(3 - workouts.length);

      workouts = [...workouts, ...defaultWorkouts];
    }

    return workouts.map(w => w._id);
  } catch (error) {
    console.error('Error calculating workout recommendations:', error);
    throw error;
  }
}

async function calculateNutritionRecommendations(preferences) {
  try {
    // İlk olarak tam eşleşen beslenme planlarını bul
    let nutritionPlans = await Nutrition.find({
      targetGoals: { $in: preferences.goals },
      difficulty: preferences.fitnessLevel === 'beginner' ? 'easy' :
                 preferences.fitnessLevel === 'intermediate' ? 'medium' : 'hard'
    }).limit(3);

    // Eğer yeterli plan bulunamazsa, kriterleri genişlet
    if (nutritionPlans.length < 3) {
      const additionalPlans = await Nutrition.find({
        $or: [
          { targetGoals: { $in: preferences.goals } },
          { difficulty: 'medium' }
        ],
        _id: { $nin: nutritionPlans.map(n => n._id) }
      }).limit(3 - nutritionPlans.length);

      nutritionPlans = [...nutritionPlans, ...additionalPlans];
    }

    return nutritionPlans.map(n => n._id);
  } catch (error) {
    console.error('Error calculating nutrition recommendations:', error);
    throw error;
  }
} 