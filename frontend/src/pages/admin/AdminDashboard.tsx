import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axios';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: Array<{ date: string; count: number; }>;
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
    totalViews: number;
  };
  newsletter: {
    totalSubscribers: number;
    newThisMonth: number;
    growth: Array<{ date: string; count: number; }>;
  };
  content: {
    workouts: number;
    nutrition: number;
  };
}

interface RecentActivity {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  blogs: Array<{
    _id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
  subscribers: Array<{
    _id: string;
    email: string;
    subscribedAt: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/dashboard/stats');

      if (response.data.success) {
        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity);
      }
    } catch (err: any) {
      console.error('Fetch dashboard data error:', err);
      setError('Dashboard verileri yüklenemedi.');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gösterge Paneli</h1>
          <p className="mt-1 text-sm text-gray-500">
            FitPlanner yönetici paneline hoş geldiniz! 👑
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Users Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
                    {stats.users.newThisMonth > 0 && (
                      <p className="ml-2 text-sm text-green-600">+{stats.users.newThisMonth} bu ay</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Tüm kullanıcıları görüntüle →
                </Link>
              </div>
            </div>

            {/* Blog Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Blog Yazıları</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.blogs.total}</p>
                    <p className="ml-2 text-sm text-gray-600">
                      ({stats.blogs.published} yayında)
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/blogs"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Blog yönetimine git →
                </Link>
              </div>
            </div>

            {/* Newsletter Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Bülten Aboneleri</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.newsletter.totalSubscribers}</p>
                    {stats.newsletter.newThisMonth > 0 && (
                      <p className="ml-2 text-sm text-green-600">+{stats.newsletter.newThisMonth} bu ay</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/newsletter"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500"
                >
                  Aboneleri yönet →
                </Link>
              </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Toplam İçerik</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.content.workouts + stats.content.nutrition}
                    </p>
                    <p className="ml-2 text-sm text-gray-600">
                      ({stats.content.workouts} antrenman, {stats.content.nutrition} beslenme)
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/content"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  İçerikleri yönet →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentActivity && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Son Kayıt Olan Kullanıcılar</h3>
                <div className="flow-root mt-6">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentActivity.users.map((user) => (
                      <li key={user._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Blog Posts */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Son Blog Yazıları</h3>
                <div className="flow-root mt-6">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentActivity.blogs.map((blog) => (
                      <li key={blog._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {blog.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {blog.status === 'published' ? '✅ Yayında' : '📝 Taslak'}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {formatDate(blog.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Newsletter Subscribers */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Son Bülten Aboneleri</h3>
                <div className="flow-root mt-6">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentActivity.subscribers.map((subscriber) => (
                      <li key={subscriber._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {subscriber.email}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {formatDate(subscriber.subscribedAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 