import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
}

interface Post {
  id: string;
  type: 'workout' | 'nutrition' | 'progress' | 'achievement';
  author: string;
  authorAvatar?: string;
  title: string;
  content: string;
  media?: string[];
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isShared: boolean;
  visibility: 'public' | 'followers' | 'private';
}

interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  isFollowing: boolean;
  followers: number;
  following: number;
  workouts: number;
  achievements: number;
}

const CommunityFeatures: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'following' | 'discover' | 'leaderboard'>('feed');
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockPosts: Post[] = [
    {
      id: '1',
      type: 'achievement',
      author: 'Ahmet Yılmaz',
      authorAvatar: '👨‍💪',
      title: '100 Push-up Hedefi Tamamlandı!',
      content: 'Sonunda 100 push-up hedefime ulaştım! 3 ay sürdü ama değdi. Motivasyon için teşekkürler arkadaşlar! 💪',
      timestamp: new Date().toISOString(),
      likes: 24,
      comments: [
        {
          id: '1-1',
          author: 'Ayşe Kaya',
          content: 'Harika! Tebrikler 🎉',
          timestamp: new Date().toISOString(),
          likes: 3,
          replies: [],
          isLiked: false
        }
      ],
      shares: 5,
      isLiked: false,
      isShared: false,
      visibility: 'public'
    },
    {
      id: '2',
      type: 'workout',
      author: 'Mehmet Demir',
      authorAvatar: '🏋️‍♂️',
      title: 'Bugünkü Antrenman',
      content: 'Bacak gününü tamamladım. Squat 5x5 100kg ile! Yeni rekorum 🔥',
      media: ['workout-photo.jpg'],
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 18,
      comments: [],
      shares: 2,
      isLiked: true,
      isShared: false,
      visibility: 'public'
    },
    {
      id: '3',
      type: 'nutrition',
      author: 'Zeynep Şahin',
      authorAvatar: '🥗',
      title: 'Protein Smoothie Tarifi',
      content: 'Post-workout smoothie tarifi: 1 muz, 1 scoop protein, 1 bardak süt, 1 çorba kaşığı fıstık ezmesi. Muhteşem lezzet!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: 31,
      comments: [
        {
          id: '3-1',
          author: 'Can Özkan',
          content: 'Tarif için teşekkürler! Deneyeceğim',
          timestamp: new Date().toISOString(),
          likes: 1,
          replies: [],
          isLiked: false
        }
      ],
      shares: 8,
      isLiked: false,
      isShared: true,
      visibility: 'public'
    }
  ];

  const mockUsers: CommunityUser[] = [
    {
      id: '1',
      name: 'Fitness Guru',
      avatar: '🏆',
      isFollowing: false,
      followers: 1250,
      following: 89,
      workouts: 365,
      achievements: 47
    },
    {
      id: '2', 
      name: 'Protein Queen',
      avatar: '💪',
      isFollowing: true,
      followers: 890,
      following: 156,
      workouts: 234,
      achievements: 28
    },
    {
      id: '3',
      name: 'CardioKing',
      avatar: '🏃‍♂️',
      isFollowing: false,
      followers: 567,
      following: 203,
      workouts: 445,
      achievements: 33
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setCommunityUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    const comment = newComment[postId];
    if (!comment?.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: user?.name || 'Anonim',
      content: comment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false
    };

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newCommentObj] }
        : post
    ));

    setNewComment(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isShared: !post.isShared, shares: post.isShared ? post.shares - 1 : post.shares + 1 }
        : post
    ));
    setShowShareModal(null);
  };

  const handleFollow = (userId: string) => {
    setCommunityUsers(prev => prev.map(user =>
      user.id === userId
        ? { 
            ...user, 
            isFollowing: !user.isFollowing,
            followers: user.isFollowing ? user.followers - 1 : user.followers + 1
          }
        : user
    ));
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'workout': return '💪';
      case 'nutrition': return '🥗';
      case 'progress': return '📈';
      case 'achievement': return '🏆';
      default: return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Az önce';
    if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} saat önce`;
    return `${Math.floor(diffMinutes / 1440)} gün önce`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Topluluk yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Fitness Topluluğu</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Fitness yolculuğunuzu paylaşın ve başkalarından ilham alın</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex justify-center space-x-8">
          {[
            { id: 'feed', label: 'Ana Akış', icon: '🏠' },
            { id: 'following', label: 'Takip Ettiklerim', icon: '👥' },
            { id: 'discover', label: 'Keşfet', icon: '🔍' },
            { id: 'leaderboard', label: 'Liderlik Tablosu', icon: '🏆' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* New Post */}
          {activeTab === 'feed' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Bugünkü antrenmandan bahsedj, başarını paylaş veya bir soru sor..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-primary-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-primary-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4" />
                        </svg>
                      </button>
                    </div>
                    <button
                      disabled={!newPost.trim()}
                      className="btn-primary disabled:opacity-50 text-sm"
                    >
                      Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">{post.authorAvatar || '👤'}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{post.author}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getPostIcon(post.type)} {formatTimestamp(post.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.visibility === 'public' ? 'bg-green-100 text-green-800' :
                      post.visibility === 'followers' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.visibility === 'public' ? '🌍 Herkese Açık' :
                       post.visibility === 'followers' ? '👥 Takipçiler' : '🔒 Özel'}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{post.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{post.content}</p>
                  
                  {post.media && post.media.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {post.media.map((media, index) => (
                        <div key={index} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">📷</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        post.isLiked 
                          ? 'text-red-600' 
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{post.likes}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{post.comments.length}</span>
                    </button>

                    <button
                      onClick={() => setShowShareModal(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        post.isShared 
                          ? 'text-green-600' 
                          : 'text-gray-500 hover:text-green-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                </div>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{comment.author}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-3 mt-1">
                            <button className="text-xs text-gray-500 hover:text-primary-600">Beğen</button>
                            <button className="text-xs text-gray-500 hover:text-primary-600">Yanıtla</button>
                            <span className="text-xs text-gray-400">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Comment */}
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Yorum ekle..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                      />
                    </div>
                    <button
                      onClick={() => handleComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Suggested Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Takip Edilebilir Kişiler</h3>
            <div className="space-y-4">
              {communityUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">{user.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.followers} takipçi • {user.workouts} antrenman
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user.id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      user.isFollowing 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {user.isFollowing ? 'Takipten Çık' : 'Takip Et'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Topluluk İstatistikleri</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Aktif Üyeler:</span>
                <span className="font-medium">1,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bu hafta paylaşım:</span>
                <span className="font-medium">324</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Toplam beğeni:</span>
                <span className="font-medium">15,678</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Paylaş</h3>
              <button
                onClick={() => setShowShareModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleShare(showShareModal)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-2xl">📋</span>
                <span className="text-gray-900 dark:text-gray-100">Kopyala</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-2xl">💬</span>
                <span className="text-gray-900 dark:text-gray-100">WhatsApp</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-2xl">📧</span>
                <span className="text-gray-900 dark:text-gray-100">E-posta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeatures; 