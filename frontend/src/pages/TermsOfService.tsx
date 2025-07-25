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
                Kullanım Şartları
              </h1>
              <p className="text-lg text-gray-600">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş ve Kabul</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Bu kullanım şartları ("Şartlar"), FitPlanner platformunu ("Hizmet") kullanmanızla 
                    ilgili koşulları belirler. Hizmeti kullanarak bu şartları kabul etmiş sayılırsınız. 
                    Bu şartları kabul etmiyorsanız, lütfen hizmeti kullanmayın.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hizmet Açıklaması</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    FitPlanner, fitness ve beslenme takibi için dijital bir platformdur. Hizmetimiz aşağıdakileri içerir:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Kişiselleştirilmiş antrenman programları</li>
                    <li>Beslenme planları ve kalori takibi</li>
                    <li>İlerleme takibi ve analitik</li>
                    <li>Motivasyon ve öneriler</li>
                    <li>Blog ve eğitim içerikleri</li>
                    <li>Topluluk özellikleri</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hesap Oluşturma ve Güvenlik</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1. Hesap Gereksinimleri</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>13 yaş üzerinde olmanız gerekir</li>
                        <li>Doğru ve güncel bilgiler sağlamalısınız</li>
                        <li>Kişi başına yalnızca bir hesap oluşturabilirsiniz</li>
                        <li>Hesap bilgilerinizi güncel tutmakla yükümlüsünüz</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2. Güvenlik</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Şifrenizi güvenli tutmakla yükümlüsünüz</li>
                        <li>Hesabınızdaki tüm aktivitelerden sorumlusunuz</li>
                        <li>Şüpheli aktiviteleri derhal bildirmelisiniz</li>
                        <li>Hesabınızı başkalarıyla paylaşamazsınız</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Kabul Edilebilir Kullanım</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Hizmeti kullanırken aşağıdaki davranışlarda bulunamazsınız:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Yasadışı, zararlı veya rahatsız edici içerik paylaşmak</li>
                    <li>Diğer kullanıcıları taciz etmek veya tehdit etmek</li>
                    <li>Spam veya istenmeyen mesajlar göndermek</li>
                    <li>Virüs, malware veya zararlı kod yaymak</li>
                    <li>Sistemi hacklemek veya güvenlik açıkları aramak</li>
                    <li>Telif hakkı ihlali yapan içerik paylaşmak</li>
                    <li>Yanıltıcı veya sahte bilgiler sağlamak</li>
                    <li>Ticari amaçlarla spam yapmak</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. İçerik ve Fikri Mülkiyet</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1. Kullanıcı İçeriği</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Platformda paylaştığınız içeriklerin (antrenman verileri, yorumlar, fotoğraflar) 
                        sorumluluğu size aittir. Bu içerikleri paylaşma hakkınız olduğunu garanti edersiniz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2. Platform İçeriği</h3>
                      <p className="text-gray-600 leading-relaxed">
                        FitPlanner'daki tüm içerikler (metin, görsel, yazılım) FitPlanner Teknoloji A.Ş.'nin 
                        mülkiyetindedir ve telif hakları ile korunmaktadır. İzin almadan kopyalanamaz veya dağıtılamaz.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sağlık ve Güvenlik Uyarıları</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Önemli Sağlık Uyarısı</h3>
                        <p className="text-yellow-700">
                          FitPlanner bir sağlık hizmeti sağlayıcısı değildir. Sunduğumuz bilgiler eğitim amaçlıdır 
                          ve tıbbi tavsiye yerine geçmez. Herhangi bir fitness programına başlamadan önce doktorunuza danışın.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Egzersiz yaparken kendi limitinizi bilin</li>
                    <li>Sağlık sorununuz varsa önce doktor onayı alın</li>
                    <li>Beslenme planları kişisel durumunuza uygun olmayabilir</li>
                    <li>Ağrı hissettiğinizde egzersize ara verin</li>
                    <li>Hamilelik, kronik hastalık durumlarında özel önlem alın</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Ödeme ve Abonelik</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">7.1. Ücretsiz Hizmetler</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Temel özellikler ücretsizdir ve hesap oluşturmanızla birlikte kullanıma sunulur.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">7.2. Premium Abonelik</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Aylık veya yıllık ödeme seçenekleri mevcuttur</li>
                        <li>Abonelik otomatik olarak yenilenir</li>
                        <li>İptal etmek için 24 saat önceden bildirim gerekir</li>
                        <li>İade politikamız web sitesinde belirtilmiştir</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Hizmet Kullanılabilirliği</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Hizmetimizi 7/24 erişilebilir kılmaya çalışırız, ancak aşağıdaki durumlar garanti edilmez:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Teknik bakım dönemlerinde kesintiler olabilir</li>
                    <li>İnternet bağlantı sorunları hizmeti etkileyebilir</li>
                    <li>Sunucu arızaları geçici kesintilere neden olabilir</li>
                    <li>Güvenlik önlemleri hizmeti geçici olarak durdurabilir</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Sorumluluk Reddi</h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-700 leading-relaxed">
                      <strong>FitPlanner:</strong><br />
                      • Sağlık sorunları için tıbbi tavsiye vermez<br />
                      • Kullanıcı verilerinin kaybolması durumunda sorumluluk kabul etmez<br />
                      • Üçüncü taraf hizmetlerden kaynaklanan sorunlardan sorumlu değildir<br />
                      • Hizmetteki geçici kesintilerden dolayı zarara neden olmaz<br />
                      • Kullanıcıların birbirleriyle olan etkileşimlerinden sorumlu değildir
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Hesap Sonlandırma</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">10.1. Kullanıcı Tarafından</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Hesabınızı istediğiniz zaman silebilirsiniz. Silme işlemi geri alınamaz ve 
                        tüm verileriniz kalıcı olarak silinir.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">10.2. FitPlanner Tarafından</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Kullanım şartlarını ihlal ettiğiniz takdirde hesabınızı askıya alabilir veya 
                        silebiliriz. Bu durumda önceden bildirim yapmaya çalışırız.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Değişiklikler</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Bu kullanım şartlarını gerektiğinde güncelleyebiliriz. Önemli değişiklikler için 
                    e-posta ile bildirim göndereceğiz. Değişiklikler yayınlandıktan sonra hizmeti 
                    kullanmaya devam etmeniz yeni şartları kabul ettiğiniz anlamına gelir.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Uygulanacak Hukuk</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlık durumunda 
                    İstanbul mahkemeleri yetkilidir.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">13. İletişim</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Kullanım şartları ile ilgili sorularınız için:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>E-posta:</strong> legal@fitplanner.com</li>
                      <li><strong>Adres:</strong> Maslak Mahallesi, Sarıyer, İstanbul 34485</li>
                      <li><strong>Telefon:</strong> +90 (212) 555-0123</li>
                    </ul>
                  </div>
                </section>

                <section className="border-t pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Şirket Bilgileri</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Şirket Adı:</strong> FitPlanner Teknoloji Anonim Şirketi<br />
                      <strong>Adres:</strong> Maslak Mahallesi, Sarıyer, İstanbul 34485<br />
                      <strong>Vergi No:</strong> 1234567890<br />
                      <strong>Ticaret Sicil No:</strong> 123456<br />
                      <strong>E-posta:</strong> info@fitplanner.com
                    </p>
                  </div>
                </section>

                <section className="text-center pt-8 border-t">
                  <p className="text-sm text-gray-500">
                    Bu belge, FitPlanner Teknoloji A.Ş. ile sizin aranızdaki yasal sözleşmeyi oluşturur.
                  </p>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 