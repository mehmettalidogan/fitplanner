import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const howItWorksSteps = [
    {
      title: "Hesabınızı Oluşturun",
      description: "Ücretsiz üye olun ve kişisel bilgilerinizi girin. Boy, kilo, yaş ve hedefleriniz doğrultusunda size özel bir program oluşturalım.",
      icon: "📝"
    },
    {
      title: "Programınızı Seçin",
      description: "Hedeflerinize uygun antrenman ve beslenme programını seçin. İster kilo vermek, ister kas kazanmak için özel programlar.",
      icon: "🎯"
    },
    {
      title: "Takibe Başlayın",
      description: "Günlük antrenmanlarınızı ve beslenmenizi takip edin. İlerlemenizi grafiklerle görün ve motivasyonunuzu koruyun.",
      icon: "📊"
    },
    {
      title: "Sonuçları Görün",
      description: "Düzenli takip ve program ile hedeflerinize ulaşın. Başarı hikayenizi oluşturun ve formunuzu koruyun.",
      icon: "🏆"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-secondary-100 relative pt-16">
        {/* Arkaplan resmi için overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/img/background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.9)',
          }}
        />
        
        {/* Ana İçerik */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black mb-4 text-shadow">
              FitPlanner ile Formunuzu Koruyun
            </h1>
            <p className="text-xl text-black mb-8 text-shadow-sm">
              Antrenman planınızı oluşturun, beslenmenizi takip edin ve hedeflerinize ulaşın.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-action-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-action-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Hemen Başla
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              title="Antrenman Planlayıcı"
              description="Günlük antrenman programınızı oluşturun ve takip edin."
            />
            <FeatureCard
              title="Beslenme Takibi"
              description="Makroları takip edin, yemek günlüğü tutun."
            />
            <FeatureCard
              title="İlerleme Analizi"
              description="Gelişiminizi grafiklerle görselleştirin."
            />
          </div>
        </div>

        {/* Nasıl Çalışır Bölümü */}
        <div className="relative z-10 bg-white/95 py-20 mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary-800 text-center mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-secondary-600 text-center mb-16 max-w-3xl mx-auto">
              FitPlanner ile formunuzu korumanın 4 kolay adımı
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={step.title}
                  className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-primary-700 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-secondary-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/register')}
                className="bg-action-yellow-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-action-yellow-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Hemen Üye Ol
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-4 border-primary-500">
      <h3 className="text-xl font-semibold text-primary-700 mb-3">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
};

export default LandingPage; 