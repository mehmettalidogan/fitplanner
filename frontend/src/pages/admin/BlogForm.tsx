import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BlogEditor from '../../components/BlogEditor';
import axiosInstance from '../../utils/axios';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string | string[];
  featuredImage: string;
  status: 'draft' | 'published';
  isSticky: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
}

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: 'genel',
    tags: '',
    featuredImage: '',
    status: 'draft',
    isSticky: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = [
    { value: 'antrenman', label: '🏋️ Antrenman' },
    { value: 'beslenme', label: '🥗 Beslenme' },
    { value: 'motivasyon', label: '💪 Motivasyon' },
    { value: 'saglik', label: '🏥 Sağlık' },
    { value: 'yasamtarzi', label: '🌟 Yaşam Tarzı' },
    { value: 'genel', label: '📝 Genel' }
  ];

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/blog/admin/${id}`);
      
      if (response.data.success) {
        const blog = response.data.blog;
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          category: blog.category || 'genel',
          tags: blog.tags ? blog.tags.join(', ') : '',
          featuredImage: blog.featuredImage || '',
          status: blog.status || 'draft',
          isSticky: blog.isSticky || false,
          seo: {
            metaTitle: blog.seo?.metaTitle || '',
            metaDescription: blog.seo?.metaDescription || '',
            metaKeywords: blog.seo?.metaKeywords ? blog.seo.metaKeywords.join(', ') : ''
          }
        });
      }
    } catch (err: any) {
      console.error('Fetch blog error:', err);
      setError('Blog yazısı yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id, isEditing, fetchBlog]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('seo.')) {
      const seoField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear messages on input
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      setSaving(true);
      setError(null);

      if (!formData.title.trim()) {
        setError('Başlık gereklidir.');
        return;
      }

      if (!formData.content.trim()) {
        setError('İçerik gereklidir.');
        return;
      }

      const submitData = {
        ...formData,
        status,
        tags: typeof formData.tags === 'string' 
          ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : formData.tags,
        seo: {
          ...formData.seo,
          metaKeywords: formData.seo.metaKeywords.split(',').map((keyword: string) => keyword.trim()).filter(Boolean)
        }
      };

      let response;
      if (isEditing) {
        response = await axiosInstance.put(`/api/blog/${id}`, submitData);
      } else {
        response = await axiosInstance.post('/api/blog', submitData);
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 1500);
      }

    } catch (err: any) {
      console.error('Save blog error:', err);
      setError(err.response?.data?.message || 'Blog kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    
    const confirmed = window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.');
    if (!confirmed) return;

    try {
      setSaving(true);
      const response = await axiosInstance.delete(`/api/blog/${id}`);
      
      if (response.data.success) {
        setSuccess('Blog yazısı silindi.');
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 1000);
      }
    } catch (err: any) {
      console.error('Delete blog error:', err);
      setError(err.response?.data?.message || 'Blog silinirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'Mevcut blog yazısını düzenleyin' : 'Yeni bir blog yazısı oluşturun'}
            </p>
          </div>
          
          <button
            onClick={() => navigate('/admin/blogs')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            ← Geri Dön
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Blog yazısı başlığı..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="etiket1, etiket2, etiket3"
              />
              <p className="mt-1 text-xs text-gray-500">Virgülle ayırın</p>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öne Çıkan Resim URL
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isSticky}
                  onChange={(e) => handleInputChange('isSticky', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">📌 Sabitlenmiş</span>
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özet
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Blog yazısının kısa özeti..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik *
            </label>
            <BlogEditor
              value={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              height="500px"
            />
          </div>

          {/* SEO Settings */}
          <details className="border border-gray-200 rounded-lg">
            <summary className="cursor-pointer p-4 font-medium text-gray-700 hover:bg-gray-50">
              🔍 SEO Ayarları
            </summary>
            <div className="p-4 border-t space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Başlık
                </label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => handleInputChange('seo.metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="SEO için optimize edilmiş başlık"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.seo.metaTitle.length}/60 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama
                </label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => handleInputChange('seo.metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="SEO için meta açıklama"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.seo.metaDescription.length}/160 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Anahtar Kelimeler
                </label>
                <input
                  type="text"
                  value={formData.seo.metaKeywords}
                  onChange={(e) => handleInputChange('seo.metaKeywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="kelime1, kelime2, kelime3"
                />
                <p className="mt-1 text-xs text-gray-500">Virgülle ayırın</p>
              </div>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              {isEditing && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  🗑️ Sil
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : '📝 Taslak Olarak Kaydet'}
              </button>
              
              <button
                onClick={() => handleSubmit('published')}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Yayınlanıyor...' : '🚀 Yayınla'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogForm; 