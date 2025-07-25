import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../utils/axios';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

interface WeightStats {
  current: number;
  change: number;
  highest: number;
  lowest: number;
  entries: number;
}

const WeightTracker: React.FC = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | 'all'>('3m');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<WeightStats>({ current: 0, change: 0, highest: 0, lowest: 0, entries: 0 });

  // Load weight data on component mount and period change
  useEffect(() => {
    loadWeightData();
  }, [selectedPeriod]);

  const loadWeightData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/analytics/weight?period=${selectedPeriod}`);
      if (response.data?.entries) {
        const entries = response.data.entries.map((entry: any) => ({
          id: entry._id,
          date: new Date(entry.date).toISOString().split('T')[0],
          weight: entry.weight,
          note: entry.notes || ''
        }));
        setWeightEntries(entries);
        
        if (response.data.stats) {
          setStats({
            current: response.data.stats.current || 0,
            change: response.data.stats.change || 0,
            highest: response.data.stats.max || 0,
            lowest: response.data.stats.min || 0,
            entries: entries.length
          });
        }
      }
    } catch (error) {
      console.error('Weight data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats are now loaded from backend

  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (selectedPeriod) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'all':
        return weightEntries;
    }

    return weightEntries.filter(entry => new Date(entry.date) >= startDate);
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    setLoading(true);
    
    try {
      const response = await axiosInstance.post('/api/analytics/weight', {
        weight: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0],
        notes: newNote || undefined
      });

      if (response.data) {
        // Reload data to get updated stats
        await loadWeightData();
        setNewWeight('');
        setNewNote('');
      }
    } catch (error: any) {
      console.error('Kilo kaydedilirken hata:', error);
      alert(error.response?.data?.message || 'Kilo kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/analytics/weight/${id}`);
      // Reload data to get updated stats
      await loadWeightData();
    } catch (error) {
      console.error('Kilo kaydı silinirken hata:', error);
      alert('Kilo kaydı silinirken hata oluştu');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatDateLong = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Stats are loaded from backend via loadWeightData
  const chartData = getFilteredData().map(entry => ({
    date: formatDate(entry.date),
    weight: entry.weight,
    fullDate: entry.date
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Kilo Takibi
        </h2>
        <div className="flex space-x-2">
          {(['1m', '3m', '6m', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period === 'all' ? 'Tümü' : period.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Mevcut Kilo</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.current ? `${stats.current} kg` : '-'}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Değişim</div>
          <div className={`text-2xl font-bold ${
            stats.change > 0 ? 'text-red-600' : 
            stats.change < 0 ? 'text-green-600' : 
            'text-gray-900 dark:text-gray-100'
          }`}>
            {stats.change !== 0 ? `${stats.change > 0 ? '+' : ''}${stats.change.toFixed(1)} kg` : '-'}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">En Yüksek</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.highest ? `${stats.highest} kg` : '-'}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">En Düşük</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.lowest ? `${stats.lowest} kg` : '-'}
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Kilo Değişim Grafiği
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Kilo']}
                  labelFormatter={(label) => {
                    const entry = chartData.find(d => d.date === label);
                    return entry ? formatDateLong(entry.fullDate) : label;
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add New Entry Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Yeni Kilo Kaydı Ekle
        </h3>
        <form onSubmit={handleAddWeight} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kilo (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="input-field"
                placeholder="75.5"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Not (isteğe bağlı)
              </label>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="input-field"
                placeholder="Bugünkü durum..."
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !newWeight}
                className="btn-primary disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Weight History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Son Kayıtlar
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {weightEntries.slice(-10).reverse().map((entry) => (
            <div 
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {entry.weight} kg
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDateLong(entry.date)}
                  {entry.note && ` • ${entry.note}`}
                </div>
              </div>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                title="Kaydı sil"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          
          {weightEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Henüz kilo kaydınız bulunmuyor. İlk kaydınızı ekleyin!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightTracker; 