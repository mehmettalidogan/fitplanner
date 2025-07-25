import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  location: string;
  status: 'success' | 'failed' | 'suspicious';
}

interface TwoFactorSettings {
  enabled: boolean;
  backupCodes: string[];
  lastUsed?: string;
}

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const [emailVerified, setEmailVerified] = useState(true);
  const [twoFactor, setTwoFactor] = useState<TwoFactorSettings>({
    enabled: false,
    backupCodes: []
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load security data on component mount
  useEffect(() => {
    loadSecurityData();
    loadSecurityLogs();
  }, []);

  const loadSecurityData = async () => {
    try {
      const response = await axiosInstance.get('/api/security/summary');
      if (response.data) {
        setEmailVerified(response.data.emailVerified);
        setTwoFactor({
          enabled: response.data.twoFactorEnabled,
          backupCodes: []
        });
      }
    } catch (error) {
      setError('Güvenlik bilgileri yüklenirken hata oluştu.');
    }
  };

  const loadSecurityLogs = async () => {
    try {
      const response = await axiosInstance.get('/api/security/logs?limit=10');
      if (response.data?.logs) {
        setSecurityLogs(response.data.logs.map((log: any) => ({
          id: log._id,
          action: log.action,
          timestamp: log.createdAt,
          ipAddress: log.ipAddress,
          device: log.userAgent || 'Unknown',
          location: `${log.location?.city || 'Unknown'}, ${log.location?.country || 'Unknown'}`,
          status: log.status === 'success' ? 'success' : 'failed'
        })));
      }
    } catch (error) {
      console.error('Security logs load error:', error);
    }
  };

  // Mock data fallback
  const mockSecurityLogs: SecurityLog[] = [
    {
      id: '1',
      action: 'Başarılı giriş',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      device: 'Chrome, Windows',
      location: 'Istanbul, Turkey',
      status: 'success'
    },
    {
      id: '3',
      action: 'Başarısız giriş denemesi',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      ipAddress: 'unknown',
      device: 'Unknown',
      location: 'Unknown',
      status: 'failed'
    }
  ];

  useEffect(() => {
    setSecurityLogs(mockSecurityLogs);
  }, []);

  const handleSendVerificationEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axiosInstance.post('/api/security/send-verification');
      setSuccess('Doğrulama e-postası gönderildi! Lütfen e-posta kutunuzu kontrol edin.');
      
      // Development mode preview link
      if (response.data.previewUrl) {
        console.log('Email preview:', response.data.previewUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-posta gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First setup 2FA
      const setupResponse = await axiosInstance.post('/api/security/2fa/setup');
      
      if (setupResponse.data.qrCode) {
        // Show QR code for user to scan
        setShowQRCode(true);
        // You would display the QR code here
        setSuccess('QR kodu taratın ve doğrulama kodunu girin.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '2FA kurulumunda hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode.trim()) {
      setError('Doğrulama kodu gerekli.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/api/security/2fa/verify', {
        token: verificationCode
      });

      setTwoFactor({
        enabled: true,
        backupCodes: response.data.backupCodes || [],
        lastUsed: new Date().toISOString()
      });
      
      setShowQRCode(false);
      setVerificationCode('');
      setSuccess('İki faktörlü kimlik doğrulama başarıyla etkinleştirildi!');
    } catch (err: any) {
      setError(err.response?.data?.message || '2FA doğrulama hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt('Güvenlik için şifrenizi girin:');
    if (!password) return;

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axiosInstance.post('/api/security/2fa/disable', { password });
      setTwoFactor({ enabled: false, backupCodes: [] });
      setSuccess('İki faktörlü kimlik doğrulama devre dışı bırakıldı');
    } catch (err) {
      setError('2FA devre dışı bırakılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="text-green-500">✅</span>;
      case 'failed':
        return <span className="text-red-500">❌</span>;
      case 'suspicious':
        return <span className="text-yellow-500">⚠️</span>;
      default:
        return <span className="text-gray-500">ℹ️</span>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('tr-TR');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Email Verification */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">E-posta Doğrulama</h2>
            <p className="text-gray-600 dark:text-gray-400">Hesap güvenliği için e-postanızı doğrulayın</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            emailVerified 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {emailVerified ? '✅ Doğrulandı' : '⏳ Beklemede'}
          </div>
        </div>

        {!emailVerified && (
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div>
              <p className="text-yellow-800 dark:text-yellow-300 font-medium">E-posta adresi doğrulanmamış</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleSendVerificationEmail}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'Doğrulama Gönder'}
            </button>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">İki Faktörlü Kimlik Doğrulama</h2>
            <p className="text-gray-600 dark:text-gray-400">Hesabınız için ekstra güvenlik katmanı</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            twoFactor.enabled 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }`}>
            {twoFactor.enabled ? '🔒 Etkin' : '🔓 Pasif'}
          </div>
        </div>

        {!twoFactor.enabled ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 mb-2">
                <strong>İki faktörlü kimlik doğrulama nedir?</strong>
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Şifrenize ek olarak telefonunuzdaki bir uygulama ile oluşturulan kodu da girmenizi gerektiren güvenlik özelliğidir.
              </p>
            </div>

            {!showQRCode ? (
              <button
                onClick={() => setShowQRCode(true)}
                className="btn-primary"
              >
                2FA'yı Etkinleştir
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📱</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">QR Kod burada görünecek</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Google Authenticator, Authy veya benzer bir uygulama ile QR kodu tarayın
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="input-field"
                    maxLength={6}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleEnable2FA}
                    disabled={loading || verificationCode.length !== 6}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Doğrulanıyor...' : 'Etkinleştir'}
                  </button>
                  <button
                    onClick={() => {
                      setShowQRCode(false);
                      setVerificationCode('');
                    }}
                    className="btn-secondary"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-800 dark:text-green-300 font-medium">✅ 2FA etkinleştirildi</p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                Son kullanım: {twoFactor.lastUsed && formatTimestamp(twoFactor.lastUsed)}
              </p>
            </div>

            {/* Backup Codes */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Yedek Kodlar</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Telefonunuza erişemediğinizde kullanabileceğiniz kodlar:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {twoFactor.backupCodes.map((code, index) => (
                  <span key={index} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {code}
                  </span>
                ))}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                ⚠️ Bu kodları güvenli bir yerde saklayın. Her kod sadece bir kez kullanılabilir.
              </p>
            </div>

            <button
              onClick={handleDisable2FA}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Devre dışı bırakılıyor...' : '2FA\'yı Devre Dışı Bırak'}
            </button>
          </div>
        )}
      </div>

      {/* Security Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Güvenlik Günlüğü</h2>
            <p className="text-gray-600 dark:text-gray-400">Son hesap aktiviteleriniz</p>
          </div>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Tümünü Görüntüle
          </button>
        </div>

        <div className="space-y-3">
          {securityLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(log.status)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{log.action}</p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span>{log.device}</span> • <span>{log.location}</span> • <span>{log.ipAddress}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimestamp(log.timestamp)}
              </div>
            </div>
          ))}
        </div>

        {securityLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p>Henüz güvenlik aktivitesi bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings; 