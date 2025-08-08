# FitPlanner

Kişisel fitness planlama, beslenme takibi, blog ve bülten yönetimi, öneri sistemi, güvenlik ve analiz özelliklerini bir araya getiren tam yığın (MERN) bir uygulama.

## Özellikler
- Kimlik doğrulama (JWT)
- Kullanıcı paneli: antrenman, beslenme, kilo takibi
- Öneri motoru (kişiselleştirilmiş program ve beslenme önerileri)
- Blog ve bülten (newsletter) yönetimi
- Global arama ve gelişmiş analizler (admin)
- Güvenlik ayarları ve günlükleri
- PWA hazırlığı (service worker)
- Karanlık mod, performans odaklı bileşenler ve optimizasyonlar

## Monorepo Yapısı
```
fitplanner/
  backend/      # Express + MongoDB API
  frontend/     # React + TypeScript istemci
```

## Gereksinimler
- Node.js 18+ ve npm
- MongoDB (lokalde veya barındırılan)

## Kurulum
1) Depoyu klonlayın ve kök dizine geçin:
```bash
git clone <repo-url>
cd fitplanner
```

2) Ortam değişkenlerini oluşturun:
- Backend: `backend/.env` dosyasını `backend/env.example` üzerinden kopyalayıp doldurun.
- Frontend: `frontend/.env` dosyasını `frontend/env.example` üzerinden kopyalayıp doldurun.

Backend `.env` örneği:
```
MONGODB_URI=mongodb://localhost:27017/fitplanner
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=development
```

Frontend `.env` örneği:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

3) Bağımlılıkları yükleyin:
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Geliştirme Ortamı
- Backend (http://localhost:5000):
```bash
cd backend
npm run dev
```
- Frontend (http://localhost:3000):
```bash
cd frontend
npm start
```
CORS `http://localhost:3000` için açıktır ve API tabanı `/api` altındadır.

## Build ve Dağıtım
- Frontend üretim derlemesi:
```bash
cd frontend
npm run build
```
- Backend üretimde `PORT`, `MONGODB_URI`, `JWT_SECRET` ve e-posta ayarlarını `.env` ile sağlayın.
- Ters proxy (NGINX vb.) üzerinden frontend statik dosyaları ve backend API yönlendirmesi tavsiye edilir.

## Seed Script’ler
Aşağıdaki script’lerle başlangıç verilerini yükleyebilirsiniz:
```bash
cd backend
node src/scripts/seedAdmin.js
node src/scripts/seedNutrition.js
node src/scripts/seedWorkouts.js
```

## Önemli Klasörler ve Dosyalar
- Backend API rotaları: `backend/src/routes/*`
- Kontrolcüler: `backend/src/controllers/*`
- Modeller: `backend/src/models/*`
- E-posta servisi: `backend/src/services/emailService.js`
- Service Worker (PWA): `frontend/public/sw.js`
- React uygulaması: `frontend/src/*`

## Faydalı Script’ler
- Backend: `npm run dev` (hot-reload), `npm start`
- Frontend: `npm start`, `npm run build`, `npm test`

## Sorun Giderme
- MongoDB bağlantı hataları için `MONGODB_URI` ve veritabanı servis durumunu kontrol edin.
- CORS hatalarında frontend URL’sinin backend’teki CORS yapılandırmasıyla eşleştiğinden emin olun.
- E-posta gönderimi için uygulama şifresi ve SMTP bilgilerini doğrulayın.

## Lisans
Bu proje için lisans belirtilmemiştir. Gerekirse uygun bir lisans ekleyin (örn. MIT).
