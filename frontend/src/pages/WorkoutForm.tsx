import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

interface WorkoutFormData {
  name: string;
  exercises: Exercise[];
  notes?: string;
}

const WorkoutForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<WorkoutFormData>({
    name: '',
    exercises: [{ name: '', sets: 0, reps: 0, weight: 0 }],
    notes: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Antrenman kaydedilemedi');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-primary-800 mb-6">Yeni Antrenman Ekle</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antrenman Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Egzersizler
            </label>
            {formData.exercises.map((exercise, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Egzersiz Adı</label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Set Sayısı</label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tekrar Sayısı</label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ağırlık (kg)</label>
                    <input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="text-red-600 text-sm hover:text-red-800"
                >
                  Egzersizi Sil
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExercise}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              + Yeni Egzersiz Ekle
            </button>
          </div>

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
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm; 