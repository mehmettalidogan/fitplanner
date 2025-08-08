import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axios';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author: {
    name: string;
    email: string;
  };
  views: number;
  likes: number;
  isSticky: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readingTime: number;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const categories = [
    { value: '', label: 'Tüm Kategoriler' },
    { value: 'antrenman', label: '🏋️ Antrenman' },
    { value: 'beslenme', label: '🥗 Beslenme' },
    { value: 'motivasyon', label: '💪 Motivasyon' },
    { value: 'saglik', label: '🏥 Sağlık' },
    { value: 'yasamtarzi', label: '🌟 Yaşam Tarzı' },
    { value: 'genel', label: '📝 Genel' }
  ];

  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'published', label: '✅ Yayınlanmış' },
    { value: 'draft', label: '📝 Taslak' },
    { value: 'archived', label: '📦 Arşivlenmiş' }
  ];

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search })
      });

      const response = await axiosInstance.get(`/api/blog?${params}`);
      
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (err: any) {
      console.error('Fetch blogs error:', err);
      setError('Blog yazıları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchBlogs();
  }, [filters, pagination.page, fetchBlogs]);

  const handleStatusChange = async (blogId: string, newStatus: string) => {
    try {
      let response;
      if (newStatus === 'published') {
        response = await axiosInstance.put(`/api/blog/${blogId}/publish`);
      } else {
        response = await axiosInstance.put(`/api/blog/${blogId}`, { status: newStatus });
      }

      if (response.data.success) {
        // Update local state
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog._id === blogId 
              ? { ...blog, status: newStatus as any, publishedAt: newStatus === 'published' ? new Date().toISOString() : blog.publishedAt }
              : blog
          )
        );
      }
    } catch (err: any) {
      console.error('Update status error:', err);
      alert('Durum güncellenirken hata oluştu.');
    }
  };

  const handleDelete = async (blogId: string) => {
    const confirmed = window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?');
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete(`/api/blog/${blogId}`);
      
      if (response.data.success) {
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      }
    } catch (err: any) {
      console.error('Delete blog error:', err);
      alert('Blog silinirken hata oluştu.');
    }
  };

  const getStatusBadge = (status: string, isSticky: boolean) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    let statusClasses = "";
    let statusText = "";
    
    switch (status) {
      case 'published':
        statusClasses = "bg-green-100 text-green-800";
        statusText = "Yayında";
        break;
      case 'draft':
        statusClasses = "bg-yellow-100 text-yellow-800";
        statusText = "Taslak";
        break;
      case 'archived':
        statusClasses = "bg-gray-100 text-gray-800";
        statusText = "Arşiv";
        break;
      default:
        statusClasses = "bg-gray-100 text-gray-800";
        statusText = status;
    }

    return (
      <div className="flex items-center space-x-2">
        <span className={`${baseClasses} ${statusClasses}`}>
          {statusText}
        </span>
        {isSticky && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📌 Sabit
          </span>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-500">
              Blog yazılarını görüntüleyin ve yönetin
            </p>
          </div>
          
          <Link
            to="/admin/blogs/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Yeni Blog Yazısı</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
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
                placeholder="Başlık veya içerik ara..."
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
          ) : blogs.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Blog yazısı bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Henüz hiç blog yazısı yok. İlk yazıyı oluşturmak için aşağıdaki butona tıklayın.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/blogs/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni Blog Yazısı
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yazı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İstatistikler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="flex items-start space-x-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {blog.title}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {blog.excerpt || 'Özet bulunmuyor...'}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {blog.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {tag}
                                    </span>
                                  ))}
                                  {blog.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{blog.tags.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {categories.find(c => c.value === blog.category)?.label || blog.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(blog.status, blog.isSticky)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div>👁️ {blog.views.toLocaleString()} görüntüleme</div>
                            <div>❤️ {blog.likes.toLocaleString()} beğeni</div>
                            <div>⏱️ {blog.readingTime} dk okuma</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div>Oluşturuldu: {formatDate(blog.createdAt)}</div>
                            {blog.publishedAt && (
                              <div>Yayınlandı: {formatDate(blog.publishedAt)}</div>
                            )}
                            <div className="text-xs">Yazar: {blog.author.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Status dropdown */}
                            <select
                              value={blog.status}
                              onChange={(e) => handleStatusChange(blog._id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="draft">Taslak</option>
                              <option value="published">Yayınla</option>
                              <option value="archived">Arşivle</option>
                            </select>

                            {/* Edit button */}
                            <Link
                              to={`/admin/blogs/edit/${blog._id}`}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
                        Toplam <span className="font-medium">{pagination.total}</span> yazı, 
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

export default BlogManagement; 