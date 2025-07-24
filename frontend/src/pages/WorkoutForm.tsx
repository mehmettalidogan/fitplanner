import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

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

const WorkoutForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'strength',
    difficultyLevel: 'beginner',
    daysPerWeek: 3,
    targetGoals: ['muscle_gain'],
    estimatedTime: 45,
    caloriesBurn: 300,
    workoutDays: [
      {
        name: 'Gün 1',
        exercises: [
          { name: '', sets: 3, reps: '12', notes: '' }
        ]
      }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post('/api/workouts', formData);
      navigate('/dashboard', { state: { workoutUpdated: true } });
    } catch (err: any) {
      console.error('Antrenman ekleme hatası:', err);
      setError(err.response?.data?.message || 'Antrenman eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const addWorkoutDay = () => {
    setFormData(prev => ({
      ...prev,
      workoutDays: [
        ...prev.workoutDays,
        {
          name: `Gün ${prev.workoutDays.length + 1}`,
          exercises: [{ name: '', sets: 3, reps: '12', notes: '' }]
        }
      ]
    }));
  };

  const addExercise = (dayIndex: number) => {
    const newWorkoutDays = [...formData.workoutDays];
    newWorkoutDays[dayIndex].exercises.push({ name: '', sets: 3, reps: '12', notes: '' });
    setFormData({ ...formData, workoutDays: newWorkoutDays });
  };

  const handleDayChange = (index: number, field: keyof WorkoutDay, value: string) => {
    const newWorkoutDays = [...formData.workoutDays];
    newWorkoutDays[index] = { ...newWorkoutDays[index], [field]: value };
    setFormData({ ...formData, workoutDays: newWorkoutDays });
  };

  const handleExerciseChange = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    const newWorkoutDays = [...formData.workoutDays];
    newWorkoutDays[dayIndex].exercises[exerciseIndex] = {
      ...newWorkoutDays[dayIndex].exercises[exerciseIndex],
      [field]: value
    };
    setFormData({ ...formData, workoutDays: newWorkoutDays });
  };

  const removeWorkoutDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      workoutDays: prev.workoutDays.filter((_, index) => index !== dayIndex)
    }));
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newWorkoutDays = [...formData.workoutDays];
    newWorkoutDays[dayIndex].exercises = newWorkoutDays[dayIndex].exercises.filter((_, index) => index !== exerciseIndex);
    setFormData({ ...formData, workoutDays: newWorkoutDays });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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

          <div className="space-y-6 pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Antrenman Bilgileri</h3>
              <p className="mt-1 text-sm text-gray-500">Antrenmanın temel bilgilerini girin.</p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Antrenman Adı
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Antrenman Tipi
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="strength">Kuvvet</option>
                  <option value="cardio">Kardiyo</option>
                  <option value="flexibility">Esneklik</option>
                  <option value="hiit">HIIT</option>
                  <option value="yoga">Yoga</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700">
                  Zorluk Seviyesi
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="beginner">Başlangıç</option>
                  <option value="intermediate">Orta Seviye</option>
                  <option value="advanced">İleri Seviye</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="daysPerWeek" className="block text-sm font-medium text-gray-700">
                  Haftalık Gün Sayısı
                </label>
                <input
                  type="number"
                  name="daysPerWeek"
                  id="daysPerWeek"
                  min="1"
                  max="7"
                  value={formData.daysPerWeek}
                  onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">
                  Tahmini Süre (dakika)
                </label>
                <input
                  type="number"
                  name="estimatedTime"
                  id="estimatedTime"
                  min="1"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="caloriesBurn" className="block text-sm font-medium text-gray-700">
                  Yakılan Kalori
                </label>
                <input
                  type="number"
                  name="caloriesBurn"
                  id="caloriesBurn"
                  min="1"
                  value={formData.caloriesBurn}
                  onChange={(e) => setFormData({ ...formData, caloriesBurn: parseInt(e.target.value) })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Hedefler</label>
                <div className="mt-2 space-y-2">
                  {['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength', 'flexibility'].map((goal) => (
                    <div key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        id={goal}
                        checked={formData.targetGoals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, targetGoals: [...formData.targetGoals, goal] });
                          } else {
                            setFormData({
                              ...formData,
                              targetGoals: formData.targetGoals.filter(g => g !== goal)
                            });
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor={goal} className="ml-2 text-sm text-gray-700">
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
            </div>
          </div>

          <div className="space-y-6 pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Antrenman Günleri</h3>
              <p className="mt-1 text-sm text-gray-500">Her gün için egzersizleri belirleyin.</p>
            </div>

            <div className="space-y-8">
              {formData.workoutDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={day.name}
                      onChange={(e) => handleDayChange(dayIndex, 'name', e.target.value)}
                      className="text-lg font-medium border-none focus:ring-0 p-0"
                      placeholder="Gün Adı"
                    />
                    <button
                      type="button"
                      onClick={() => removeWorkoutDay(dayIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Günü Sil
                    </button>
                  </div>

                  <div className="space-y-4">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-start border-b pb-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Hareket Adı</label>
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Set</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tekrar</label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">Notlar</label>
                          <input
                            type="text"
                            value={exercise.notes}
                            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>

                        <div className="flex justify-end sm:col-span-1">
                          <button
                            type="button"
                            onClick={() => removeExercise(dayIndex, exerciseIndex)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Hareketi Sil
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addExercise(dayIndex)}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Hareket Ekle
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addWorkoutDay}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Yeni Gün Ekle
              </button>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm; 