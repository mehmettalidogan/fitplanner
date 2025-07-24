const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Recommendation = require('../models/Recommendation');

class RecommendationService {
  // Kullanıcının fitness seviyesine ve tercihlerine göre puan hesaplama
  calculateWorkoutScore(workout, userPreferences) {
    let score = 0;
    
    // Fitness seviyesi uyumu
    if (workout.difficultyLevel === userPreferences.fitnessLevel) {
      score += 5;
    }
    
    // Egzersiz tipi tercihleri
    if (userPreferences.workoutPreferences.includes(workout.type)) {
      score += 3;
    }
    
    // Hedef uyumu
    if (workout.targetGoals.some(goal => userPreferences.goals.includes(goal))) {
      score += 4;
    }

    return score;
  }

  // Beslenme önerilerini puanlama
  calculateNutritionScore(nutrition, userPreferences) {
    let score = 0;
    
    // Diyet kısıtlamaları kontrolü
    const hasRestrictions = userPreferences.dietaryRestrictions.some(
      restriction => nutrition.ingredients.includes(restriction)
    );
    if (!hasRestrictions) {
      score += 5;
    }
    
    // Hedef uyumu
    if (nutrition.targetGoals.some(goal => userPreferences.goals.includes(goal))) {
      score += 4;
    }

    return score;
  }

  async generateRecommendations(userId) {
    try {
      // Kullanıcı tercihlerini al
      const userRecommendation = await Recommendation.findOne({ userId });
      if (!userRecommendation) {
        throw new Error('User preferences not found');
      }

      // Tüm egzersiz ve beslenme verilerini al
      const allWorkouts = await Workout.find({});
      const allNutrition = await Nutrition.find({});

      // Egzersizleri puanla ve sırala
      const scoredWorkouts = allWorkouts.map(workout => ({
        workout,
        score: this.calculateWorkoutScore(workout, userRecommendation.preferences)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.workout._id);

      // Beslenme önerilerini puanla ve sırala
      const scoredNutrition = allNutrition.map(nutrition => ({
        nutrition,
        score: this.calculateNutritionScore(nutrition, userRecommendation.preferences)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.nutrition._id);

      // Önerileri güncelle
      userRecommendation.recommendedWorkouts = scoredWorkouts;
      userRecommendation.recommendedNutrition = scoredNutrition;
      userRecommendation.lastUpdated = new Date();
      
      await userRecommendation.save();

      return userRecommendation;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RecommendationService(); 