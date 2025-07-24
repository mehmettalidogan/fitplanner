import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ScaleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../utils/axios';
import UserProfile from '../components/UserProfile';
import { useAuth } from '../context/AuthContext';

interface MacroData {
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCalories?: number;
}

interface WeeklyData {
  day: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
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

interface UserData {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goal?: string;
  activityLevel?: string;
  dailyCalorieTarget?: number;
  profileImage?: string;
  macroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
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
      const [userResponse, dailyResponse, weeklyResponse, workoutsResponse] = await Promise.all([
        axiosInstance.get('/api/auth/profile'),
        axiosInstance.get('/api/nutrition/daily-macros'),
        axiosInstance.get('/api/nutrition/weekly-macros'),
        axiosInstance.get('/api/workouts/weekly')
      ]);

      setUserData(userResponse.data);
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
    <div className="min-h-screen bg-secondary-100 bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/dashboard.png)` }}>
      <div className="min-h-screen bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header - Logout Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış
            </button>
          </div>
          
          {/* Hızlı Erişim Butonları */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => navigate('/workout/new')}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Antrenman Ekle
            </button>
            <button
              onClick={() => navigate('/nutrition/new')}
              className="flex items-center px-4 py-2 bg-action-yellow-600 text-white rounded-lg hover:bg-action-yellow-700 focus:outline-none focus:ring-2 focus:ring-action-yellow-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Öğün Ekle
            </button>
            <button
              onClick={() => navigate('/preferences')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Tercihler ve Öneriler
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kullanıcı Profili */}
            {userData && (
              <div className="lg:col-span-3">
                <UserProfile user={userData} onProfileUpdate={fetchData} />
              </div>
            )}

            {/* Haftalık Antrenman Programı */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Makro Takibi */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-action-yellow-100 rounded-lg">
                  <ScaleIcon className="h-6 w-6 text-action-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold ml-3 text-primary-800">Günlük Makrolar</h2>
              </div>
              <div className="space-y-6">
                <MacroProgress 
                  title="Kalori" 
                  current={dailyMacros.totalCalories || 0} 
                  target={userData?.dailyCalorieTarget || 2000} 
                  color="bg-primary-500" 
                  textColor="text-primary-700"
                  unit="kcal"
                />
                <MacroProgress 
                  title="Protein" 
                  current={dailyMacros.totalProtein} 
                  target={userData?.macroTargets?.protein || targetMacros.protein} 
                  color="bg-action-green-500" 
                  textColor="text-action-green-700"
                  unit="g" 
                />
                <MacroProgress 
                  title="Karbonhidrat" 
                  current={dailyMacros.totalCarbs} 
                  target={userData?.macroTargets?.carbs || targetMacros.carbs} 
                  color="bg-action-yellow-500" 
                  textColor="text-action-yellow-700"
                  unit="g" 
                />
                <MacroProgress 
                  title="Yağ" 
                  current={dailyMacros.totalFat} 
                  target={userData?.macroTargets?.fat || targetMacros.fat} 
                  color="bg-action-orange-500" 
                  textColor="text-action-orange-700"
                  unit="g" 
                />
              </div>
            </div>

            {/* Motivasyon */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-semibold mb-6 text-primary-800">Haftalık Makro Takibi</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Makrolar Grafiği */}
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
                {/* Kalori Grafiği */}
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
                        dataKey="calories" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ fill: '#22c55e', strokeWidth: 2 }}
                        name="Kalori"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
  unit: string;
}

const MacroProgress: React.FC<MacroProgressProps> = ({ title, current, target, color, textColor, unit }) => {
  const percentage = (current / target) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium text-secondary-700">{title}</span>
        <span className={`font-semibold ${textColor}`}>{current}/{target}{unit}</span>
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