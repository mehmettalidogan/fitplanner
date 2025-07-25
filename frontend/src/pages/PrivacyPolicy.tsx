import React from 'react';
import Header from '../components/Header';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Gizlilik Politikası
              </h1>
              <p className="text-lg text-gray-600">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
                <p className="text-gray-600 leading-relaxed">
                  FitPlanner olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. 
                  Bu gizlilik politikası, kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve 
                  koruduğumuzu açıklamaktadır.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Topladığımız Bilgiler</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1. Kişisel Bilgiler</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Ad ve soyad</li>
                      <li>E-posta adresi</li>
                      <li>Yaş, cinsiyet, boy, kilo bilgileri</li>
                      <li>Fitness hedefleri ve tercihleri</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2. Kullanım Verileri</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Antrenman verileri</li>
                      <li>Beslenme takip bilgileri</li>
                      <li>Uygulama kullanım istatistikleri</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgileri Nasıl Kullanırız</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Kişiselleştirilmiş fitness planları oluşturmak</li>
                  <li>İlerlemenizi takip etmek</li>
                  <li>Hizmet kalitesini artırmak</li>
                  <li>Size özel öneriler sunmak</li>
                  <li>Teknik destek sağlamak</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Veri Güvenliği</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Verilerinizin güvenliği için endüstri standardı önlemler alırız:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>SSL şifreleme ile veri aktarımı</li>
                  <li>Güvenli veritabanı saklama</li>
                  <li>Düzenli güvenlik denetimleri</li>
                  <li>Sınırlı erişim kontrolü</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Haklarınız</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  KVKK ve GDPR kapsamında sahip olduğunuz haklar:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Verilerinize erişim hakkı</li>
                  <li>Düzeltme hakkı</li>
                  <li>Silme hakkı</li>
                  <li>İşleme itiraz hakkı</li>
                  <li>Veri taşınabilirliği hakkı</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. İletişim</h2>
                <p className="text-gray-600 leading-relaxed">
                  Gizlilik politikası ile ilgili sorularınız için{' '}
                  <a href="mailto:privacy@fitplanner.com" className="text-primary-600 hover:text-primary-700">
                    privacy@fitplanner.com
                  </a>{' '}
                  adresinden bize ulaşabilirsiniz.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 