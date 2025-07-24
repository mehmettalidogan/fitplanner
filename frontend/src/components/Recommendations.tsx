import React, { useEffect, useState } from 'react';
import { recommendationService } from '../utils/recommendationService';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

interface Workout {
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

interface Nutrition {
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

interface Recommendation {
  recommendedWorkouts: Workout[];
  recommendedNutrition: Nutrition[];
}

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      if (err.response?.status === 404) {
        setError('Öneri bulunamadı. Lütfen tercihlerinizi güncelleyin.');
      } else {
        setError('Öneriler yüklenirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkoutExpand = (workoutId: string) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workoutId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Antrenman Önerileri */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Önerilen Antrenmanlar</h2>
        <div className="space-y-6">
          {recommendations.recommendedWorkouts?.map((workout) => (
            <div key={workout._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {workout.type === 'strength' ? 'Kuvvet' :
                       workout.type === 'cardio' ? 'Kardiyo' :
                       workout.type === 'flexibility' ? 'Esneklik' :
                       workout.type === 'hiit' ? 'HIIT' : 'Yoga'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {workout.difficultyLevel === 'beginner' ? 'Başlangıç' :
                       workout.difficultyLevel === 'intermediate' ? 'Orta Seviye' : 'İleri Seviye'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {workout.daysPerWeek} gün/hafta
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {workout.estimatedTime} dk
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {workout.caloriesBurn} kcal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleWorkoutExpand(workout._id)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {expandedWorkout === workout._id ? 'Gizle' : 'Detaylar'}
                </button>
              </div>

              {expandedWorkout === workout._id && (
                <div className="mt-4 space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Hedefler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {workout.targetGoals?.map((goal) => (
                        <span
                          key={goal}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {goal === 'weight_loss' ? 'Kilo Verme' :
                           goal === 'muscle_gain' ? 'Kas Kazanma' :
                           goal === 'maintenance' ? 'Form Koruma' :
                           goal === 'endurance' ? 'Dayanıklılık' :
                           goal === 'strength' ? 'Kuvvet' : 'Esneklik'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-4">Antrenman Programı:</h4>
                    <div className="space-y-6">
                      {workout.workoutDays?.map((day, dayIndex) => (
                        <div key={dayIndex} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">{day.name}</h5>
                          <table className="min-w-full">
                            <thead>
                              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="px-2 py-1">Hareket</th>
                                <th className="px-2 py-1">Set</th>
                                <th className="px-2 py-1">Tekrar</th>
                                <th className="px-2 py-1">Notlar</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {day.exercises?.map((exercise, exerciseIndex) => (
                                <tr key={exerciseIndex}>
                                  <td className="px-2 py-2 text-sm text-gray-900">{exercise.name}</td>
                                  <td className="px-2 py-2 text-sm text-gray-900">{exercise.sets}</td>
                                  <td className="px-2 py-2 text-sm text-gray-900">{exercise.reps}</td>
                                  <td className="px-2 py-2 text-sm text-gray-600">{exercise.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Beslenme Önerileri */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Önerilen Beslenme Planları</h2>
        <div className="space-y-6">
          {recommendations.recommendedNutrition?.map((nutrition) => (
            <div key={nutrition._id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900">{nutrition.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{nutrition.description}</p>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Kalori</p>
                  <p className="text-lg font-semibold text-blue-900">{nutrition.calories} kcal</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Protein</p>
                  <p className="text-lg font-semibold text-green-900">{nutrition.protein}g</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Karbonhidrat</p>
                  <p className="text-lg font-semibold text-yellow-900">{nutrition.carbs}g</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Yağ</p>
                  <p className="text-lg font-semibold text-red-900">{nutrition.fat}g</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Malzemeler:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {nutrition.ingredients?.map((ingredient, index) => (
                    <li key={index} className="text-sm text-gray-600">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Hazırlanışı:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {nutrition.instructions?.map((instruction, index) => (
                    <li key={index} className="text-sm text-gray-600">{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {nutrition.preparationTime} dk hazırlık
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {nutrition.difficulty === 'easy' ? 'Kolay' :
                   nutrition.difficulty === 'medium' ? 'Orta' : 'Zor'}
                </span>
                {nutrition.targetGoals?.map((goal) => (
                  <span
                    key={goal}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {goal === 'weight_loss' ? 'Kilo Verme' :
                     goal === 'muscle_gain' ? 'Kas Kazanma' :
                     goal === 'maintenance' ? 'Form Koruma' :
                     goal === 'endurance' ? 'Dayanıklılık' :
                     goal === 'strength' ? 'Kuvvet' : 'Esneklik'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations; 