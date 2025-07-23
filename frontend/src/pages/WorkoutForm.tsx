import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

interface WorkoutFormData {
  weekDay: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
}

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const WorkoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<WorkoutFormData>({
    weekDay: DAYS[0],
    name: '',
    exercises: [{ name: '', sets: 0, reps: 0, weight: 0 }],
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const fetchWorkout = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/api/workouts/${id}`);
          setFormData(response.data);
        } catch (error: any) {
          setError(error.response?.data?.message || 'Antrenman yüklenirken bir hata oluştu.');
          console.error('Antrenman yükleme hatası:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkout();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await axiosInstance.put(`/api/workouts/${id}`, formData);
      } else {
        await axiosInstance.post('/api/workouts', formData);
      }
      navigate('/dashboard', { state: { workoutUpdated: true } });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Bir hata oluştu.');
      console.error('Form gönderme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value
    };
    setFormData({ ...formData, exercises: newExercises });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 0, reps: 0, weight: 0 }]
    });
  };

  const removeExercise = (index: number) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  return (
    <div className="min-h-screen bg-secondary-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-primary-800 mb-6">
            {id ? 'Antrenman Programını Düzenle' : 'Yeni Antrenman Programı'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Gün Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gün
              </label>
              <select
                value={formData.weekDay}
                onChange={(e) => setFormData({ ...formData, weekDay: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Örn: Göğüs Antrenmanı"
                required
              />
            </div>

            {/* Egzersizler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Egzersizler
              </label>
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Egzersiz adı"
                        required
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Set"
                        required
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Tekrar"
                        required
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Kg"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addExercise}
                className="mt-4 px-4 py-2 text-primary-600 hover:text-primary-800"
              >
                + Egzersiz Ekle
              </button>
            </div>

            {/* Notlar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notlar
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Antrenman hakkında notlar..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : id ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm; 