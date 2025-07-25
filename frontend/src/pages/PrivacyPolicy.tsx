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
              <div className="space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
                  <p className="text-gray-600 leading-relaxed">
                    FitPlanner olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. 
                    Bu gizlilik politikası, kişisel verilerinizi nasıl topladığımızı, kullandığımızı, 
                    sakladığımızı ve koruduğumuzu açıklamaktadır. KVKK (Kişisel Verilerin Korunması Kanunu) 
                    ve GDPR (Genel Veri Koruma Yönetmeliği) uyarınca hazırlanmıştır.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Topladığımız Bilgiler</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1. Kişisel Bilgiler</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Ad ve soyad</li>
                        <li>E-posta adresi</li>
                        <li>Telefon numarası (isteğe bağlı)</li>
                        <li>Yaş, cinsiyet, boy, kilo bilgileri</li>
                        <li>Profil fotoğrafı (isteğe bağlı)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2. Kullanım Verileri</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Antrenman verileri ve ilerleme kayıtları</li>
                        <li>Beslenme verileri ve kalori takibi</li>
                        <li>Uygulama kullanım istatistikleri</li>
                        <li>Cihaz bilgileri ve IP adresi</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgileri Nasıl Kullanırız</h2>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Hesabınızı oluşturmak ve yönetmek</li>
                    <li>Kişiselleştirilmiş antrenman ve beslenme planları sunmak</li>
                    <li>İlerlemenizi takip etmek ve analiz etmek</li>
                    <li>Öneriler ve motivasyon mesajları göndermek</li>
                    <li>Teknik destek sağlamak</li>
                    <li>Hizmetlerimizi geliştirmek</li>
                    <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bilgi Paylaşımı</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Kişisel verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Açık rızanızı aldığımız durumlar</li>
                    <li>Yasal zorunluluklar</li>
                    <li>Mahkeme kararları</li>
                    <li>Hizmet sağlayıcılarımızla (veri işleme anlaşması çerçevesinde)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Güvenliği</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Verilerinizin güvenliği için aşağıdaki önlemleri alırız:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>SSL şifreleme ile veri aktarımı</li>
                    <li>Güvenli veritabanı saklama</li>
                    <li>Düzenli güvenlik denetimleri</li>
                    <li>Erişim kontrolü ve yetkilendirme</li>
                    <li>Düzenli yedekleme</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Çerezler (Cookies)</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Web sitemizde deneyiminizi iyileştirmek için çerezler kullanırız:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Zorunlu Çerezler:</strong> Sitenin çalışması için gerekli</li>
                    <li><strong>Analitik Çerezler:</strong> Kullanım istatistikleri için</li>
                    <li><strong>Fonksiyonel Çerezler:</strong> Tercihlerinizi hatırlamak için</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Haklarınız</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    KVKK ve GDPR kapsamında aşağıdaki haklarınız bulunmaktadır:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                    <li>İşlenen verileriniz hakkında bilgi talep etme</li>
                    <li>Verilerin düzeltilmesini isteme</li>
                    <li>Verilerin silinmesini isteme</li>
                    <li>İşlemeye itiraz etme</li>
                    <li>Veri portabilitesi</li>
                    <li>Otomatik karar verme süreçlerine itiraz</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Veri Saklama Süreleri</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Hesap Verileri</h3>
                      <p className="text-gray-600">Hesabınızı silene kadar veya 2 yıl pasif kalana kadar</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Antrenman ve Beslenme Verileri</h3>
                      <p className="text-gray-600">Hesabınızla birlikte saklanır, istediğiniz zaman silebilirsiniz</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">İletişim Kayıtları</h3>
                      <p className="text-gray-600">Yasal zorunluluklar gereği 3 yıl</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Üçüncü Taraf Hizmetler</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Hizmetlerimizi sunabilmek için aşağıdaki üçüncü taraf hizmetleri kullanırız:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Google Analytics:</strong> Kullanım istatistikleri</li>
                    <li><strong>E-posta Sağlayıcısı:</strong> Bildirim ve newsletter gönderimi</li>
                    <li><strong>Hosting Sağlayıcısı:</strong> Veri depolama</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Çocukların Gizliliği</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Hizmetlerimiz 13 yaş altındaki çocuklara yönelik değildir. 13 yaş altında 
                    kullanıcıdan bilerek kişisel veri toplamayız. Böyle bir durumla karşılaştığımızda 
                    derhal ilgili verileri sileriz.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Politika Değişiklikleri</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
                    olduğunda size e-posta ile bildirim göndereceğiz. Politikanın güncel halini 
                    bu sayfada bulabilirsiniz.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. İletişim</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Gizlilik politikası ile ilgili sorularınız için:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>E-posta:</strong> privacy@fitplanner.com</li>
                      <li><strong>Adres:</strong> Maslak Mahallesi, Sarıyer, İstanbul 34485</li>
                      <li><strong>Telefon:</strong> +90 (212) 555-0123</li>
                    </ul>
                  </div>
                </section>

                <section className="border-t pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Veri Sorumlusu</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Şirket Adı:</strong> FitPlanner Teknoloji A.Ş.<br />
                      <strong>Adres:</strong> Maslak Mahallesi, Sarıyer, İstanbul 34485<br />
                      <strong>KVKK Sorumlusu:</strong> privacy@fitplanner.com
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 