import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ScaleIcon, ChartBarIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../utils/axios';

interface MacroData {
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface WeeklyData {
  day: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  _id: string;
  weekDay: string;
  name: string;
  exercises: Exercise[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dailyMacros, setDailyMacros] = useState<MacroData>({
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyData[]>([]);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hedef makro değerleri (bu değerler kullanıcı profilinden gelebilir)
  const targetMacros = {
    protein: 150,
    carbs: 250,
    fat: 70
  };

  const fetchData = useCallback(async () => {
    try {
      const [dailyResponse, weeklyResponse, workoutsResponse] = await Promise.all([
        axiosInstance.get('/api/nutrition/daily-macros'),
        axiosInstance.get('/api/nutrition/weekly-macros'),
        axiosInstance.get('/api/workouts/weekly')
      ]);

      setDailyMacros(dailyResponse.data);
      setWeeklyProgress(weeklyResponse.data);
      setWeeklyWorkouts(workoutsResponse.data);
      setError(null);
    } catch (error: any) {
      console.error('Veri çekme hatası:', error);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Yeni öğün eklendiğinde veya güncellendiğinde verileri yenile
  useEffect(() => {
    if (location.state?.nutritionUpdated || location.state?.workoutUpdated) {
      fetchData();
      // State'i temizle
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, fetchData, navigate]);

  // getDayName fonksiyonunu kaldır çünkü artık weekDay doğrudan geliyor

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-100 flex items-center justify-center">
        <div className="text-lg text-primary-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-100 flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hızlı Erişim Butonları */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/workout/new')}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Antrenman Ekle
          </button>
          <button
            onClick={() => navigate('/nutrition/new')}
            className="flex items-center px-4 py-2 bg-action-yellow-600 text-white rounded-lg hover:bg-action-yellow-700 focus:outline-none focus:ring-2 focus:ring-action-yellow-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Öğün Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Haftalık Antrenman Programı */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold ml-3 text-primary-800">Haftalık Antrenman Programı</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gün</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weeklyWorkouts.map((workout) => (
                    <tr key={workout._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {workout.weekDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workout.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          {workout.exercises.map((exercise, idx) => (
                            <div key={idx} className="text-xs">
                              {exercise.name} - {exercise.sets}x{exercise.reps} ({exercise.weight}kg)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => navigate(`/workout/edit/${workout._id}`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Makro Takibi */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-action-yellow-100 rounded-lg">
                <ScaleIcon className="h-6 w-6 text-action-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3 text-primary-800">Günlük Makrolar</h2>
            </div>
            <div className="space-y-6">
              <MacroProgress 
                title="Protein" 
                current={dailyMacros.totalProtein} 
                target={targetMacros.protein} 
                color="bg-primary-500" 
                textColor="text-primary-700" 
              />
              <MacroProgress 
                title="Karbonhidrat" 
                current={dailyMacros.totalCarbs} 
                target={targetMacros.carbs} 
                color="bg-action-yellow-500" 
                textColor="text-action-yellow-700" 
              />
              <MacroProgress 
                title="Yağ" 
                current={dailyMacros.totalFat} 
                target={targetMacros.fat} 
                color="bg-action-orange-500" 
                textColor="text-action-orange-700" 
              />
            </div>
          </div>

          {/* Motivasyon */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-action-orange-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-action-orange-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3 text-primary-800">Günün Sözü</h2>
            </div>
            <p className="text-lg text-secondary-600 italic text-center mt-4">
              "Başarı bir yolculuktur, varış noktası değil."
            </p>
          </div>

          {/* Haftalık Makro Grafiği */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-6 text-primary-800">Haftalık Makro Takibi</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="protein" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', strokeWidth: 2 }}
                    name="Protein"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbs" 
                    stroke="#eab308" 
                    strokeWidth={2}
                    dot={{ fill: '#eab308', strokeWidth: 2 }}
                    name="Karbonhidrat"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fat" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ fill: '#f97316', strokeWidth: 2 }}
                    name="Yağ"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MacroProgressProps {
  title: string;
  current: number;
  target: number;
  color: string;
  textColor: string;
}

const MacroProgress: React.FC<MacroProgressProps> = ({ title, current, target, color, textColor }) => {
  const percentage = (current / target) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium text-secondary-700">{title}</span>
        <span className={`font-semibold ${textColor}`}>{current}/{target}g</span>
      </div>
      <div className="w-full bg-secondary-100 rounded-full h-2.5 overflow-hidden">
        <div
          style={{ width: `${Math.min(percentage, 100)}%` }}
          className={`${color} rounded-full h-2.5 transition-all duration-1000 ease-out`}
        />
      </div>
    </div>
  );
};

export default Dashboard; 