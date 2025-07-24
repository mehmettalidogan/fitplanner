import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axios';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  source: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  preferences: {
    workoutTips: boolean;
    nutritionTips: boolean;
    newPrograms: boolean;
    blogUpdates: boolean;
  };
}

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
}

const NewsletterManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    source: '',
    isActive: 'true'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const sourceOptions = [
    { value: '', label: 'Tüm Kaynaklar' },
    { value: 'blog', label: '📝 Blog' },
    { value: 'homepage', label: '🏠 Ana Sayfa' },
    { value: 'programs', label: '💪 Programlar' },
    { value: 'nutrition', label: '🥗 Beslenme' }
  ];

  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'true', label: '✅ Aktif' },
    { value: 'false', label: '❌ Pasif' }
  ];

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscribers
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.source && { source: filters.source }),
        ...(filters.isActive && { isActive: filters.isActive })
      });

      const [subscribersResponse, statsResponse] = await Promise.all([
        axiosInstance.get(`/api/newsletter/subscribers?${params}`),
        axiosInstance.get('/api/newsletter/stats')
      ]);
      
      if (subscribersResponse.data.success) {
        setSubscribers(subscribersResponse.data.subscribers);
        setPagination(prev => ({
          ...prev,
          total: subscribersResponse.data.pagination.total,
          pages: subscribersResponse.data.pagination.pages
        }));
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

    } catch (err: any) {
      console.error('Fetch newsletter data error:', err);
      setError('Newsletter verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email: string) => {
    const confirmed = window.confirm('Bu aboneyi listeden çıkarmak istediğinizden emin misiniz?');
    if (!confirmed) return;

    try {
      const response = await axiosInstance.post('/api/newsletter/unsubscribe', { email });
      
      if (response.data.success) {
        // Update local state
        setSubscribers(prevSubs => 
          prevSubs.map(sub => 
            sub.email === email 
              ? { ...sub, isActive: false, unsubscribedAt: new Date().toISOString() }
              : sub
          )
        );
      }
    } catch (err: any) {
      console.error('Unsubscribe error:', err);
      alert(err.response?.data?.message || 'Abonelik iptal edilirken hata oluştu.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceBadge = (source: string) => {
    const sourceMap: { [key: string]: string } = {
      blog: '📝 Blog',
      homepage: '🏠 Ana Sayfa',
      programs: '💪 Programlar',
      nutrition: '🥗 Beslenme'
    };

    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {sourceMap[source] || source}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✅ Aktif
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        ❌ Pasif
      </span>
    );
  };

  const getPreferencesText = (preferences: Subscriber['preferences']) => {
    const activePrefs = Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        const prefMap: { [key: string]: string } = {
          workoutTips: 'Antrenman',
          nutritionTips: 'Beslenme',
          newPrograms: 'Programlar',
          blogUpdates: 'Blog'
        };
        return prefMap[key];
      });

    return activePrefs.length > 0 ? activePrefs.join(', ') : 'Hiçbiri';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Newsletter abonelerini görüntüleyin ve yönetin
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Toplam Abone</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Aktif Abone</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Abonelik İptal</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unsubscribed}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kaynak
              </label>
              <select
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={filters.isActive}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arama
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Email veya isim ara..."
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Abone bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Arama kriterlerinize uygun abone bulunamadı.
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Abone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kaynak & Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tercihler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarihler
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {subscriber.name || 'İsimsiz'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {subscriber.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {getSourceBadge(subscriber.source)}
                            {getStatusBadge(subscriber.isActive)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>
                            {getPreferencesText(subscriber.preferences)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="space-y-1">
                            <div>Abone: {formatDate(subscriber.subscribedAt)}</div>
                            {subscriber.unsubscribedAt && (
                              <div>İptal: {formatDate(subscriber.unsubscribedAt)}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {subscriber.isActive && (
                              <button
                                onClick={() => handleUnsubscribe(subscriber.email)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Abonelikten Çıkar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between items-center">
                      <p className="text-sm text-gray-700">
                        Toplam <span className="font-medium">{pagination.total}</span> abone, 
                        sayfa <span className="font-medium">{pagination.page}</span> / <span className="font-medium">{pagination.pages}</span>
                      </p>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Önceki
                        </button>
                        
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sonraki
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsletterManagement; 