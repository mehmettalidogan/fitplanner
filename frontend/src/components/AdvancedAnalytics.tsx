import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axiosInstance from '../utils/axios';

interface AnalyticsData {
  workouts: WorkoutAnalytics;
  nutrition: NutritionAnalytics;
  progress: ProgressAnalytics;
  goals: GoalAnalytics;
}

interface WorkoutAnalytics {
  totalWorkouts: number;
  totalDuration: number; // minutes
  averageDuration: number;
  caloriesBurned: number;
  favoriteExercises: { name: string; count: number }[];
  weeklyProgress: { week: string; workouts: number; duration: number }[];
  muscleGroupDistribution: { name: string; value: number; color: string }[];
}

interface NutritionAnalytics {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  waterIntake: number;
  mealDistribution: { meal: string; calories: number }[];
  weeklyNutrition: { week: string; calories: number; protein: number }[];
}

interface ProgressAnalytics {
  weightChange: { date: string; weight: number; change: number }[];
  strengthProgress: { exercise: string; startWeight: number; currentWeight: number; improvement: number }[];
  bodyMeasurements: { measurement: string; start: number; current: number; change: number }[];
  achievements: { title: string; date: string; description: string }[];
}

interface GoalAnalytics {
  completedGoals: number;
  activeGoals: number;
  goalCompletion: { month: string; completed: number; total: number }[];
  goalCategories: { category: string; completed: number; total: number }[];
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'nutrition' | 'progress' | 'goals'>('overview');
  const [loading, setLoading] = useState(true);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/analytics/summary?period=${selectedPeriod}`);
      
      if (response.data) {
        // Use backend data if available, otherwise fallback to mock
        setAnalyticsData(response.data.summary ? transformBackendData(response.data) : mockData);
      } else {
        setAnalyticsData(mockData);
      }
    } catch (error) {
      console.error('Analytics data load error:', error);
      setAnalyticsData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const transformBackendData = (backendData: any): AnalyticsData => {
    return {
      workouts: {
        totalWorkouts: backendData.summary?.workouts?.totalWorkouts || 0,
        totalDuration: backendData.summary?.workouts?.totalTime || 0,
        averageDuration: backendData.summary?.workouts?.avgTime || 0,
        caloriesBurned: backendData.summary?.workouts?.totalCalories || 0,
        favoriteExercises: [],
        weeklyProgress: backendData.charts?.workoutProgress || [],
        muscleGroupDistribution: Object.entries(backendData.summary?.workouts?.typeDistribution || {}).map(([name, value]) => ({
          name,
          value: value as number,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
        }))
      },
      nutrition: {
        averageCalories: backendData.summary?.nutrition?.avgCalories || 0,
        averageProtein: backendData.summary?.nutrition?.avgProtein || 0,
        averageCarbs: backendData.summary?.nutrition?.avgCarbs || 0,
        averageFat: backendData.summary?.nutrition?.avgFat || 0,
        waterIntake: 2.5,
        mealDistribution: [],
        weeklyNutrition: backendData.charts?.nutritionProgress || []
      },
      progress: {
        weightChange: backendData.charts?.weightProgress?.map((entry: any) => ({
          date: entry.date,
          weight: entry.weight,
          change: 0 // Calculate from previous entry if needed
        })) || [],
        strengthProgress: [],
        bodyMeasurements: [],
        achievements: []
      },
      goals: {
        completedGoals: 8,
        activeGoals: 4,
        goalCompletion: [],
        goalCategories: []
      }
    };
  };

  // Mock data
  const mockData: AnalyticsData = {
    workouts: {
      totalWorkouts: 48,
      totalDuration: 2880, // 48 hours
      averageDuration: 60,
      caloriesBurned: 14400,
      favoriteExercises: [
        { name: 'Push-ups', count: 32 },
        { name: 'Squats', count: 28 },
        { name: 'Bench Press', count: 24 },
        { name: 'Deadlift', count: 20 }
      ],
      weeklyProgress: [
        { week: 'Hafta 1', workouts: 3, duration: 180 },
        { week: 'Hafta 2', workouts: 4, duration: 240 },
        { week: 'Hafta 3', workouts: 4, duration: 250 },
        { week: 'Hafta 4', workouts: 5, duration: 300 },
        { week: 'Hafta 5', workouts: 4, duration: 240 },
        { week: 'Hafta 6', workouts: 5, duration: 320 }
      ],
      muscleGroupDistribution: [
        { name: 'Göğüs', value: 25, color: '#3B82F6' },
        { name: 'Bacak', value: 30, color: '#10B981' },
        { name: 'Sırt', value: 20, color: '#F59E0B' },
        { name: 'Omuz', value: 15, color: '#EF4444' },
        { name: 'Kol', value: 10, color: '#8B5CF6' }
      ]
    },
    nutrition: {
      averageCalories: 2150,
      averageProtein: 120,
      averageCarbs: 250,
      averageFat: 80,
      waterIntake: 2.5,
      mealDistribution: [
        { meal: 'Kahvaltı', calories: 450 },
        { meal: 'Öğle', calories: 650 },
        { meal: 'Akşam', calories: 700 },
        { meal: 'Atıştırma', calories: 350 }
      ],
      weeklyNutrition: [
        { week: 'Hafta 1', calories: 2100, protein: 115 },
        { week: 'Hafta 2', calories: 2150, protein: 120 },
        { week: 'Hafta 3', calories: 2200, protein: 125 },
        { week: 'Hafta 4', calories: 2180, protein: 122 },
        { week: 'Hafta 5', calories: 2160, protein: 118 },
        { week: 'Hafta 6', calories: 2190, protein: 124 }
      ]
    },
    progress: {
      weightChange: [
        { date: '2024-01-01', weight: 80, change: 0 },
        { date: '2024-01-15', weight: 79.5, change: -0.5 },
        { date: '2024-02-01', weight: 79, change: -1 },
        { date: '2024-02-15', weight: 78.5, change: -1.5 },
        { date: '2024-03-01', weight: 78, change: -2 }
      ],
      strengthProgress: [
        { exercise: 'Bench Press', startWeight: 60, currentWeight: 75, improvement: 25 },
        { exercise: 'Squat', startWeight: 80, currentWeight: 100, improvement: 25 },
        { exercise: 'Deadlift', startWeight: 100, currentWeight: 125, improvement: 25 }
      ],
      bodyMeasurements: [
        { measurement: 'Göğüs', start: 95, current: 98, change: 3 },
        { measurement: 'Bel', start: 85, current: 82, change: -3 },
        { measurement: 'Kalça', start: 100, current: 98, change: -2 },
        { measurement: 'Kol', start: 32, current: 34, change: 2 }
      ],
      achievements: [
        { title: '100 Push-up Hedefi', date: '2024-02-15', description: 'Ardışık 100 push-up tamamlandı' },
        { title: 'Aylık Hedef', date: '2024-02-01', description: '20 gün antrenman hedefi aşıldı' },
        { title: 'Kilo Hedefi', date: '2024-01-15', description: '2 kg kilo verme hedefi tamamlandı' }
      ]
    },
    goals: {
      completedGoals: 12,
      activeGoals: 5,
      goalCompletion: [
        { month: 'Ocak', completed: 4, total: 6 },
        { month: 'Şubat', completed: 5, total: 7 },
        { month: 'Mart', completed: 3, total: 4 }
      ],
      goalCategories: [
        { category: 'Kilo Yönetimi', completed: 3, total: 4 },
        { category: 'Güç Artışı', completed: 4, total: 5 },
        { category: 'Kardiyovasküler', completed: 3, total: 4 },
        { category: 'Esneklik', completed: 2, total: 4 }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Analiz verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gelişmiş Analitik</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Detaylı ilerleme raporları ve analizleri</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-4 sm:mt-0">
          {(['1m', '3m', '6m', '1y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period === '1m' ? '1 Ay' : period === '3m' ? '3 Ay' : period === '6m' ? '6 Ay' : '1 Yıl'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: '📊' },
            { id: 'workouts', label: 'Antrenmanlar', icon: '💪' },
            { id: 'nutrition', label: 'Beslenme', icon: '🥗' },
            { id: 'progress', label: 'İlerleme', icon: '📈' },
            { id: 'goals', label: 'Hedefler', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-2xl">💪</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Antrenman</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsData.workouts.totalWorkouts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yakılan Kalori</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(analyticsData.workouts.caloriesBurned)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan Hedef</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsData.goals.completedGoals}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kilo Değişimi</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analyticsData.progress.weightChange[analyticsData.progress.weightChange.length - 1]?.change} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Haftalık İlerleme</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.workouts.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="workouts" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    name="Antrenman Sayısı"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="duration" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    name="Süre (dk)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Workouts Tab */}
      {activeTab === 'workouts' && (
        <div className="space-y-8">
          
          {/* Workout Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Antrenman İstatistikleri</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Toplam Süre:</span>
                  <span className="font-medium">{Math.round(analyticsData.workouts.totalDuration / 60)} saat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ortalama Süre:</span>
                  <span className="font-medium">{analyticsData.workouts.averageDuration} dk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Yakılan Kalori:</span>
                  <span className="font-medium">{formatNumber(analyticsData.workouts.caloriesBurned)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Favori Egzersizler</h3>
              <div className="space-y-2">
                {analyticsData.workouts.favoriteExercises.map((exercise, index) => (
                  <div key={exercise.name} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{index + 1}. {exercise.name}</span>
                    <span className="font-medium">{exercise.count}x</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Kas Grubu Dağılımı</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.workouts.muscleGroupDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {analyticsData.workouts.muscleGroupDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`%${value}`, 'Oran']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-8">
          
          {/* Weight Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Kilo İlerlemesi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.progress.weightChange}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Kilo']} />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strength Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Güç İlerlemesi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.progress.strengthProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="exercise" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="startWeight" fill="#94A3B8" name="Başlangıç (kg)" />
                  <Bar dataKey="currentWeight" fill="#3B82F6" name="Şu an (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Son Başarılar</h3>
            <div className="space-y-4">
              {analyticsData.progress.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(achievement.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs can be implemented similarly */}
    </div>
  );
};

export default AdvancedAnalytics; 