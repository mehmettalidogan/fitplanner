import axiosInstance from './axios';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

export interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

export interface Workout {
  _id: string;
  name: string;
  description: string;
  type: string;
  difficultyLevel: string;
  daysPerWeek: number;
  targetGoals: string[];
  estimatedTime: number;
  caloriesBurn: number;
  workoutDays: WorkoutDay[];
}

export interface Nutrition {
  _id: string;
  name: string;
  description: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  difficulty: string;
  targetGoals: string[];
}

export interface UserPreferences {
  fitnessLevel: string;
  workoutPreferences: string[];
  dietaryRestrictions: string[];
  goals: string[];
}

export interface Recommendation {
  recommendedWorkouts: Workout[];
  recommendedNutrition: Nutrition[];
}

export const recommendationService = {
  updatePreferences: async (preferences: UserPreferences): Promise<Recommendation> => {
    const response = await axiosInstance.post('/api/recommendations/preferences', preferences);
    return response.data;
  },

  getRecommendations: async (): Promise<Recommendation> => {
    const response = await axiosInstance.get('/api/recommendations');
    return response.data;
  }
}; 