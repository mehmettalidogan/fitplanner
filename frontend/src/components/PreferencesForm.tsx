import React, { useState } from 'react';
import { recommendationService } from '../utils/recommendationService';

interface FormData {
  fitnessLevel: string;
  workoutPreferences: string[];
  dietaryRestrictions: string[];
  goals: string[];
}

const PreferencesForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fitnessLevel: 'beginner',
    workoutPreferences: ['strength'],
    dietaryRestrictions: [],
    goals: ['muscle_gain']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await recommendationService.updatePreferences(formData);
      setSuccess(true);
      window.location.reload(); // Önerileri yenile
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      setError(err.response?.data?.message || 'Tercihler güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field: keyof Pick<FormData, 'workoutPreferences' | 'dietaryRestrictions' | 'goals'>, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
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
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Tercihleriniz başarıyla güncellendi.</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Fitness Seviyesi</label>
        <select
          value={formData.fitnessLevel}
          onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="beginner">Başlangıç</option>
          <option value="intermediate">Orta Seviye</option>
          <option value="advanced">İleri Seviye</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Antrenman Tercihleri</label>
        <div className="mt-2 space-y-2">
          {['strength', 'cardio', 'flexibility', 'hiit', 'yoga'].map((type) => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.workoutPreferences.includes(type)}
                onChange={() => handleCheckboxChange('workoutPreferences', type)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                {type === 'strength' ? 'Kuvvet' :
                 type === 'cardio' ? 'Kardiyo' :
                 type === 'flexibility' ? 'Esneklik' :
                 type === 'hiit' ? 'HIIT' : 'Yoga'}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Diyet Kısıtlamaları</label>
        <div className="mt-2 space-y-2">
          {['vegetarian', 'vegan', 'gluten_free', 'lactose_free'].map((restriction) => (
            <div key={restriction} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.dietaryRestrictions.includes(restriction)}
                onChange={() => handleCheckboxChange('dietaryRestrictions', restriction)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                {restriction === 'vegetarian' ? 'Vejetaryen' :
                 restriction === 'vegan' ? 'Vegan' :
                 restriction === 'gluten_free' ? 'Glutensiz' : 'Laktozsuz'}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hedefler</label>
        <div className="mt-2 space-y-2">
          {['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength', 'flexibility'].map((goal) => (
            <div key={goal} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.goals.includes(goal)}
                onChange={() => handleCheckboxChange('goals', goal)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                {goal === 'weight_loss' ? 'Kilo Verme' :
                 goal === 'muscle_gain' ? 'Kas Kazanma' :
                 goal === 'maintenance' ? 'Form Koruma' :
                 goal === 'endurance' ? 'Dayanıklılık' :
                 goal === 'strength' ? 'Kuvvet' : 'Esneklik'}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Güncelleniyor...' : 'Tercihleri Güncelle'}
        </button>
      </div>
    </form>
  );
};

export default PreferencesForm; 