import React from 'react';
import Header from '../components/Header';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Kullanım Koşulları
              </h1>
              <p className="text-lg text-gray-600">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
                <p className="text-gray-600 leading-relaxed">
                  FitPlanner platformunu kullanarak bu kullanım koşullarını kabul etmiş sayılırsınız. 
                  Lütfen bu koşulları dikkatlice okuyunuz.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hizmet Tanımı</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  FitPlanner, kullanıcılara aşağıdaki hizmetleri sunar:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Kişiselleştirilmiş antrenman programları</li>
                  <li>Beslenme takibi ve önerileri</li>
                  <li>İlerleme takibi ve analizi</li>
                  <li>Fitness blog içerikleri</li>
                  <li>Topluluk özellikleri</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hesap Oluşturma</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Hizmetlerimizi kullanmak için:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>18 yaşında veya daha büyük olmalısınız</li>
                  <li>Doğru ve güncel bilgiler vermelisiniz</li>
                  <li>Hesap güvenliğinizden sorumlusunuz</li>
                  <li>Şifrenizi kimseyle paylaşmamalısınız</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Kabul Edilebilir Kullanım</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Platform kullanırken aşağıdakileri YAPMAYINIZ:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Yasadışı aktiviteler</li>
                  <li>Başkalarını rahatsız etmek</li>
                  <li>Sahte bilgi paylaşmak</li>
                  <li>Sistemi hacklemeye çalışmak</li>
                  <li>Spam veya istenmeyen içerik göndermek</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sağlık Uyarısı</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                  <p className="text-yellow-800 font-semibold">
                    ⚠️ ÖNEMLİ SAĞLIK UYARISI
                  </p>
                  <p className="text-yellow-700 mt-2">
                    Bu platform tıbbi tavsiye vermez. Herhangi bir egzersiz programına 
                    başlamadan önce doktorunuza danışın. Sağlık sorunlarınız varsa 
                    mutlaka uzman gözetiminde hareket edin.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Ödeme ve İptal</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Temel hizmetler ücretsizdir</li>
                  <li>Premium özellikler için aylık ödeme gerekir</li>
                  <li>İptal istediğiniz zaman yapılabilir</li>
                  <li>İade talepleri değerlendirilir</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sorumluluk Reddi</h2>
                <p className="text-gray-600 leading-relaxed">
                  FitPlanner, platform kullanımından doğabilecek doğrudan veya dolaylı 
                  zararlardan sorumlu değildir. Hizmet "olduğu gibi" sunulur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Hesap Kapatma</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Hesabınızı kapatma durumları:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Kendi isteğinizle kapatabilirsiniz</li>
                  <li>Koşulları ihlal etmeniz durumunda kapatabiliriz</li>
                  <li>2 yıl pasif kalırsa otomatik kapanır</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Değişiklikler</h2>
                <p className="text-gray-600 leading-relaxed">
                  Bu koşulları güncelleyebiliriz. Önemli değişiklikler e-posta ile 
                  bildirilir. Devam eden kullanım güncel koşulları kabul etmek anlamına gelir.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. İletişim</h2>
                <p className="text-gray-600 leading-relaxed">
                  Kullanım koşulları ile ilgili sorularınız için{' '}
                  <a href="mailto:legal@fitplanner.com" className="text-primary-600 hover:text-primary-700">
                    legal@fitplanner.com
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

export default TermsOfService; 