import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // /api prefix'ini kaldırdık
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - token ekleme
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server hatası
      console.error('Server Error:', error.response.data);
      if (error.response.status === 401) {
        // Token geçersiz veya süresi dolmuş
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // İstek yapıldı ama cevap alınamadı
      console.error('Network Error:', error.request);
    } else {
      // İstek oluşturulurken hata oluştu
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 