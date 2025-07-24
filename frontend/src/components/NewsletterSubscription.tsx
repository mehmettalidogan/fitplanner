import React, { useState } from 'react';
import axiosInstance from '../utils/axios';

interface NewsletterSubscriptionProps {
  source?: string;
  showName?: boolean;
  className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ 
  source = 'blog', 
  showName = false,
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('E-posta adresi gereklidir.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/newsletter/subscribe', {
        email: email.trim().toLowerCase(),
        name: name.trim() || undefined,
        source
      });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
        setName('');
        
        // Success durumunu 5 saniye sonra gizle
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(response.data.message || 'Bir hata oluştu.');
      }
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      setError(
        err.response?.data?.message || 
        `Bağlantı hatası: ${err.message}. Backend server çalışıyor mu?`
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="text-xl font-bold text-white mb-2">Başarılı!</h4>
          <p className="text-purple-100 mb-4">
            E-posta listemize başarıyla katıldınız! Yeni yazılarımızdan haberdar olacaksınız.
          </p>
          <div className="flex items-center justify-center text-purple-100 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Hoş geldiniz! 🚀
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {showName && (
          <input
            type="text"
            placeholder="Adınız (opsiyonel)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            disabled={loading}
          />
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-60"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ekleniyor...
              </>
            ) : (
              'Abone Ol'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-300 text-white px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-purple-200 text-center">
        <p>
          📧 Spam göndermiyoruz • 🔒 Bilgileriniz güvende • ❌ İstediğiniz zaman çıkabilirsiniz
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscription; 