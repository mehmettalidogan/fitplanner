import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface Food {
  name: string;
  portion: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  time: string;
  foods: Food[];
}

interface NutritionFormData {
  meals: Meal[];
  notes?: string;
}

const NutritionForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NutritionFormData>({
    meals: [{
      name: '',
      time: '',
      foods: [{
        name: '',
        portion: 0,
        unit: 'gram',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }]
    }],
    notes: ''
  });

  const handleMealChange = (mealIndex: number, field: keyof Meal, value: string) => {
    const newMeals = [...formData.meals];
    newMeals[mealIndex] = {
      ...newMeals[mealIndex],
      [field]: value
    };
    setFormData({ ...formData, meals: newMeals });
  };

  const handleFoodChange = (mealIndex: number, foodIndex: number, field: keyof Food, value: string | number) => {
    const newMeals = [...formData.meals];
    newMeals[mealIndex].foods[foodIndex] = {
      ...newMeals[mealIndex].foods[foodIndex],
      [field]: value
    };
    setFormData({ ...formData, meals: newMeals });
  };

  const addMeal = () => {
    setFormData({
      ...formData,
      meals: [...formData.meals, {
        name: '',
        time: '',
        foods: [{
          name: '',
          portion: 0,
          unit: 'gram',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }]
      }]
    });
  };

  const addFood = (mealIndex: number) => {
    const newMeals = [...formData.meals];
    newMeals[mealIndex].foods.push({
      name: '',
      portion: 0,
      unit: 'gram',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
    setFormData({ ...formData, meals: newMeals });
  };

  const removeMeal = (mealIndex: number) => {
    const newMeals = formData.meals.filter((_, i) => i !== mealIndex);
    setFormData({ ...formData, meals: newMeals });
  };

  const removeFood = (mealIndex: number, foodIndex: number) => {
    const newMeals = [...formData.meals];
    newMeals[mealIndex].foods = newMeals[mealIndex].foods.filter((_, i) => i !== foodIndex);
    setFormData({ ...formData, meals: newMeals });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post('/api/nutrition', formData);
      // Dashboard'a yönlendir ve state'i güncelle
      navigate('/dashboard', { state: { nutritionUpdated: true } });
    } catch (err: any) {
      console.error('Hata:', err);
      setError(err.response?.data?.message || 'Beslenme kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-primary-800 mb-6">Günlük Beslenme Ekle</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          {formData.meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğün Adı
                  </label>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => handleMealChange(mealIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saat
                  </label>
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => handleMealChange(mealIndex, 'time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                {meal.foods.map((food, foodIndex) => (
                  <div key={foodIndex} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Yiyecek Adı</label>
                        <input
                          type="text"
                          value={food.name}
                          onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Miktar</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={food.portion}
                            onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'portion', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                          <select
                            value={food.unit}
                            onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'unit', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="gram">gram</option>
                            <option value="ml">ml</option>
                            <option value="adet">adet</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Kalori</label>
                        <input
                          type="number"
                          value={food.calories}
                          onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'calories', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Protein (g)</label>
                        <input
                          type="number"
                          value={food.protein}
                          onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'protein', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Karbonhidrat (g)</label>
                        <input
                          type="number"
                          value={food.carbs}
                          onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'carbs', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Yağ (g)</label>
                        <input
                          type="number"
                          value={food.fat}
                          onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'fat', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFood(mealIndex, foodIndex)}
                      className="mt-2 text-red-600 text-sm hover:text-red-800"
                    >
                      Yiyeceği Sil
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFood(mealIndex)}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  + Yeni Yiyecek Ekle
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeMeal(mealIndex)}
                className="mt-4 text-red-600 text-sm hover:text-red-800"
              >
                Öğünü Sil
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addMeal}
            className="mb-6 text-primary-600 hover:text-primary-800 font-medium"
          >
            + Yeni Öğün Ekle
          </button>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NutritionForm; 