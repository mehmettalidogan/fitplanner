import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface SearchResult {
  id: string;
  type: 'workout' | 'nutrition' | 'blog' | 'user';
  title: string;
  excerpt?: string;
  author?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  date: string;
  stats?: {
    views?: number;
    likes?: number;
    duration?: number;
    calories?: number;
    foods?: number;
    status?: string;
    lastLogin?: string;
  };
}

interface SearchFilters {
  type: 'all' | 'workout' | 'nutrition' | 'blog' | 'user';
  category: string;
  dateRange: 'all' | '1w' | '1m' | '3m' | '6m';
  sortBy: 'relevance' | 'newest' | 'oldest' | 'popular';
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    category: '',
    dateRange: 'all',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to generate URL for search results
  const getResultUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'blog':
        return `/blog/${result.id}`;
      case 'workout':
        return `/workout/${result.id}`;
      case 'nutrition':
        return `/nutrition/${result.id}`;
      case 'user':
        return `/profile/${result.id}`;
      default:
        return '/';
    }
  };

  const performSearch = useCallback(async (searchQuery: string, currentFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: '20'
      });

      if (currentFilters.type !== 'all') {
        params.append('type', currentFilters.type);
      }
      if (currentFilters.category) {
        params.append('category', currentFilters.category);
      }
      if (currentFilters.dateRange !== 'all') {
        params.append('dateRange', currentFilters.dateRange);
      }
      if (currentFilters.sortBy !== 'relevance') {
        params.append('sortBy', currentFilters.sortBy);
      }

      const response = await axiosInstance.get(`/api/search?${params.toString()}`);
      
      if (response.data && response.data.results) {
        setResults(response.data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, performSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return '💪';
      case 'nutrition':
        return '🥗';
      case 'blog':
        return '📝';
      case 'user':
        return '👤';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'workout':
        return 'Antrenman';
      case 'nutrition':
        return 'Beslenme';
      case 'blog':
        return 'Blog';
      case 'user':
        return 'Kullanıcı';
      default:
        return 'Genel';
    }
  };

  const handleResultClick = () => {
    onClose();
    setQuery('');
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Antrenman, tarif, blog yazısı ara..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Filtreleri göster/gizle"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            
            <button
              onClick={onClose}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Kapat"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tür
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="workout">Antrenman</option>
                  <option value="nutrition">Beslenme</option>
                  <option value="blog">Blog</option>
                  <option value="user">Kullanıcı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  placeholder="Kategori filtrele..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tarih
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">Tüm zamanlar</option>
                  <option value="week">Son hafta</option>
                  <option value="month">Son ay</option>
                  <option value="year">Son yıl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sıralama
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="relevance">İlgi düzeyi</option>
                  <option value="date">Tarih</option>
                  <option value="title">Alfabetik</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96 p-6">
          {query && !loading && results.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Sonuç bulunamadı</h3>
              <p>"{query}" için herhangi bir sonuç bulunamadı</p>
            </div>
          )}

          {!query && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Ara ve Keşfet</h3>
              <p>Antrenman, beslenme, blog yazıları ve daha fazlasını ara</p>
            </div>
          )}

          <div className="space-y-3">
            {results.map((result) => (
              <Link
                key={result.id}
                to={getResultUrl(result)}
                onClick={handleResultClick}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-2xl">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.title}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {result.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {result.category && (
                        <span>📂 {result.category}</span>
                      )}
                      {result.date && (
                        <span>📅 {new Date(result.date).toLocaleDateString('tr-TR')}</span>
                      )}
                      {result.stats && (
                        <span>📊 {result.stats.views || result.stats.calories || result.stats.duration || 0}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{results.length} sonuç bulundu</span>
              <div className="flex items-center space-x-4">
                <span>⌘K ile hızlı arama</span>
                <span>↑↓ ile gezin</span>
                <span>Enter ile seç</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch; 