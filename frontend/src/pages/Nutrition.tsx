import React, { useState } from 'react';
import Header from '../components/Header';

interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  mealsPerDay: number;
  targetGoals: string[];
  dailyPlan: {
    mealTime: string;
    foods: {
      name: string;
      amount: string;
      calories?: string;
      notes?: string;
    }[];
  }[];
  macros?: {
    protein: string;
    carbs: string;
    fat: string;
  };
  additionalInfo: string[];
}

const Nutrition: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPlanDetail = (plan: NutritionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closePlanDetail = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const nutritionPlans: NutritionPlan[] = [
    // Başlangıç Seviyesi Planları
    {
      id: 'beginner-a',
      name: 'Temel Kalori Takibi + Temiz Beslenme',
      description: 'Yeni başlayanlar için basit ve uygulanabilir beslenme planı. Temiz besinlerle temel kalori kontrolü.',
      duration: '4-6 hafta',
      level: 'beginner',
      mealsPerDay: 5,
      targetGoals: ['Kalori Takibi', 'Temiz Beslenme', 'Alışkanlık Oluşturma'],
      dailyPlan: [
        {
          mealTime: 'Kahvaltı',
          foods: [
            { name: 'Yumurta', amount: '2 adet', calories: '140 kcal' },
            { name: 'Tam buğday ekmeği', amount: '2 dilim', calories: '160 kcal' },
            { name: 'Domates, salatalık', amount: '1 porsiyon', calories: '30 kcal' }
          ]
        },
        {
          mealTime: 'Ara Öğün (10:00)',
          foods: [
            { name: 'Kuruyemiş karışımı', amount: '1 avuç (30g)', calories: '180 kcal' },
            { name: 'Yeşil çay', amount: '1 bardak', calories: '0 kcal' }
          ]
        },
        {
          mealTime: 'Öğle Yemeği',
          foods: [
            { name: 'Tavuk göğsü (haşlama)', amount: '150g', calories: '250 kcal' },
            { name: 'Pirinç pilavı', amount: '100g', calories: '130 kcal' },
            { name: 'Karışık sebze salatası', amount: '1 porsiyon', calories: '50 kcal' },
            { name: 'Zeytinyağı', amount: '1 tatlı kaşığı', calories: '40 kcal' }
          ]
        },
        {
          mealTime: 'Ara Öğün (16:00)',
          foods: [
            { name: 'Yoğurt (az yağlı)', amount: '1 kase', calories: '120 kcal' },
            { name: 'Muz', amount: '1 orta boy', calories: '90 kcal' }
          ]
        },
        {
          mealTime: 'Akşam Yemeği',
          foods: [
            { name: 'Balık (fırında)', amount: '150g', calories: '200 kcal' },
            { name: 'Bulgur pilavı', amount: '100g', calories: '110 kcal' },
            { name: 'Buharda sebze', amount: '1 porsiyon', calories: '60 kcal' }
          ]
        }
      ],
      additionalInfo: [
        'Günlük su tüketimi: 2.5L+',
        'Kalori hesabı: Vücut ağırlığı x 30-32',
        'Öğün saatleri düzenli tutulmalı',
        'Bol sebze tüketimi önemli'
      ]
    },
    {
      id: 'beginner-b',
      name: 'Makro Bazlı Basit Plan',
      description: 'Makro besin ögelerini temel alan basit beslenme planı. Protein, karbonhidrat ve yağ dengesine odaklanır.',
      duration: '6-8 hafta',
      level: 'beginner',
      mealsPerDay: 3,
      targetGoals: ['Makro Dengesi', 'Basit Uygulama', 'Kilo Kontrolü'],
      macros: {
        protein: '1.5g / kg',
        carbs: '3g / kg',
        fat: '0.8g / kg'
      },
      dailyPlan: [
        {
          mealTime: 'Kahvaltı',
          foods: [
            { name: 'Yulaf', amount: '60g', calories: '220 kcal', notes: 'Sütlü veya suda' },
            { name: 'Yumurta', amount: '2 adet', calories: '140 kcal' },
            { name: 'Fındık', amount: '10 adet', calories: '60 kcal' }
          ]
        },
        {
          mealTime: 'Öğle Yemeği',
          foods: [
            { name: 'Tavuk göğsü', amount: '200g', calories: '330 kcal' },
            { name: 'Jasmine pirinç', amount: '120g (pişmiş)', calories: '150 kcal' },
            { name: 'Karışık salata', amount: '1 büyük porsiyon', calories: '80 kcal' }
          ]
        },
        {
          mealTime: 'Akşam Yemeği',
          foods: [
            { name: 'Balık (somon)', amount: '150g', calories: '280 kcal' },
            { name: 'Brokoli ve karnabahar', amount: '200g', calories: '50 kcal' },
            { name: 'Avokado', amount: '1/2 adet', calories: '120 kcal' }
          ]
        }
      ],
      additionalInfo: [
        'Makrolar vücut ağırlığına göre hesaplanır',
        'Öğün zamanlaması esnek',
        'Protein her öğünde bulunmalı',
        'Karbonhidratlar antrenman öncesi/sonrası'
      ]
    },
    // Orta Seviye Planları
    {
      id: 'intermediate-a',
      name: 'Clean Bulk - Ölçülü Kalori Artışı',
      description: 'Kas kütlesi artırımı için kontrollü kalori fazlası ile temiz beslenme planı. Yağ artışını minimize eder.',
      duration: '8-12 hafta',
      level: 'intermediate',
      mealsPerDay: 4,
      targetGoals: ['Kas Kazanımı', 'Kontrollü Bulk', 'Temiz Beslenme'],
      macros: {
        protein: '2g / kg',
        carbs: '4-5g / kg',
        fat: '1g / kg'
      },
      dailyPlan: [
        {
          mealTime: 'Sabah (07:00)',
          foods: [
            { name: 'Yumurta', amount: '4 adet', calories: '280 kcal' },
            { name: 'Yulaf', amount: '80g', calories: '300 kcal' },
            { name: 'Fıstık ezmesi', amount: '2 tatlı kaşığı', calories: '180 kcal' },
            { name: 'Muz', amount: '1 adet', calories: '90 kcal' }
          ]
        },
        {
          mealTime: 'Öğle (12:30)',
          foods: [
            { name: 'Tavuk göğsü', amount: '200g', calories: '330 kcal' },
            { name: 'Jasmine pirinç', amount: '150g (pişmiş)', calories: '190 kcal' },
            { name: 'Karışık salata', amount: '1 büyük kase', calories: '100 kcal' },
            { name: 'Zeytinyağı', amount: '1 yemek kaşığı', calories: '120 kcal' }
          ]
        },
        {
          mealTime: 'Akşam (19:00)',
          foods: [
            { name: 'Kırmızı et (dana)', amount: '150g', calories: '350 kcal' },
            { name: 'Bulgur pilavı', amount: '100g', calories: '110 kcal' },
            { name: 'Buharda sebze', amount: '200g', calories: '80 kcal' }
          ]
        },
        {
          mealTime: 'Gece (22:00)',
          foods: [
            { name: 'Lor peyniri', amount: '150g', calories: '180 kcal' },
            { name: 'Yoğurt', amount: '200g', calories: '140 kcal' },
            { name: 'Ceviz', amount: '6 adet', calories: '120 kcal' }
          ]
        }
      ],
      additionalInfo: [
        'Kalori fazlası: +300-400 kcal',
        'Haftalık kilo artışı: 0.3-0.5 kg',
        'Antrenman günleri daha fazla karbonhidrat',
        'Su tüketimi: 3L+'
      ]
    },
    {
      id: 'intermediate-b',
      name: 'Meal Prep Planı',
      description: 'Haftalık hazırlık ile pratik beslenme. Meşgul yaşam tarzına uygun, hazır öğün sistemi.',
      duration: '6-10 hafta',
      level: 'intermediate',
      mealsPerDay: 5,
      targetGoals: ['Pratiklik', 'Zaman Tasarrufu', 'Tutarlılık'],
      dailyPlan: [
        {
          mealTime: 'Meal 1 (Kahvaltı)',
          foods: [
            { name: 'Overnight oats', amount: '1 porsiyon', calories: '350 kcal', notes: 'Yulaf + süt + chia' },
            { name: 'Protein tozu', amount: '1 scoop', calories: '120 kcal' }
          ]
        },
        {
          mealTime: 'Meal 2 (Ara)',
          foods: [
            { name: 'Haşlanmış yumurta', amount: '2 adet', calories: '140 kcal' },
            { name: 'Tam buğday galeta', amount: '4 adet', calories: '80 kcal' }
          ]
        },
        {
          mealTime: 'Meal 3 (Öğle)',
          foods: [
            { name: 'Tavuk + Pirinç bowl', amount: '1 meal prep kutu', calories: '450 kcal', notes: '150g tavuk + 100g pirinç' },
            { name: 'Karışık sebze', amount: '200g', calories: '60 kcal' }
          ]
        },
        {
          mealTime: 'Meal 4 (Ara)',
          foods: [
            { name: 'Balık + Patates', amount: '1 meal prep kutu', calories: '400 kcal', notes: '120g balık + 150g patates' }
          ]
        },
        {
          mealTime: 'Meal 5 (Akşam)',
          foods: [
            { name: 'Protein salata', amount: '1 büyük kase', calories: '300 kcal', notes: 'Tavuk/ton balığı + yeşillik' },
            { name: 'Avokado', amount: '1/2 adet', calories: '120 kcal' }
          ]
        }
      ],
      additionalInfo: [
        'Pazar günü 3 saatlik meal prep',
        'Her gün 3 farklı protein: tavuk, yumurta, balık',
        'Karbonhidrat rotasyonu: pirinç, yulaf, patates',
        'Buzdolabında 4 gün saklanabilir'
      ]
    },
    // İleri Seviye Planları
    {
      id: 'advanced-a',
      name: 'High Protein - Bölünmüş Makro Diyeti',
      description: 'Yüksek protein alımı ile performans odaklı beslenme. Antrenman zamanlamasına göre makro dağılımı.',
      duration: '12-16 hafta',
      level: 'advanced',
      mealsPerDay: 6,
      targetGoals: ['Yüksek Performans', 'Maksimum Protein', 'Timing Nutrition'],
      macros: {
        protein: '40%',
        carbs: '35%',
        fat: '25%'
      },
      dailyPlan: [
        {
          mealTime: 'Pre-Workout (06:00)',
          foods: [
            { name: 'Whey protein', amount: '30g', calories: '120 kcal' },
            { name: 'Muz', amount: '1 adet', calories: '90 kcal' },
            { name: 'Kahve (sade)', amount: '1 büyük', calories: '5 kcal' }
          ]
        },
        {
          mealTime: 'Post-Workout (08:30)',
          foods: [
            { name: 'Whey protein', amount: '40g', calories: '160 kcal' },
            { name: 'Jasmine pirinç', amount: '100g (pişmiş)', calories: '130 kcal' },
            { name: 'Kreatin', amount: '5g', calories: '0 kcal' }
          ]
        },
        {
          mealTime: 'Breakfast (10:00)',
          foods: [
            { name: 'Yumurta akı', amount: '6 adet', calories: '100 kcal' },
            { name: 'Yulaf', amount: '80g', calories: '300 kcal' },
            { name: 'Blueberry', amount: '100g', calories: '60 kcal' }
          ]
        },
        {
          mealTime: 'Lunch (13:00)',
          foods: [
            { name: 'Tavuk göğsü', amount: '250g', calories: '400 kcal' },
            { name: 'Tatlı patates', amount: '200g', calories: '180 kcal' },
            { name: 'Asparagus', amount: '150g', calories: '30 kcal' }
          ]
        },
        {
          mealTime: 'Snack (16:00)',
          foods: [
            { name: 'Casein protein', amount: '30g', calories: '110 kcal' },
            { name: 'Badem', amount: '20g', calories: '120 kcal' }
          ]
        },
        {
          mealTime: 'Dinner (19:00)',
          foods: [
            { name: 'Somon', amount: '200g', calories: '350 kcal' },
            { name: 'Kinoa', amount: '100g', calories: '120 kcal' },
            { name: 'Brokoli', amount: '200g', calories: '50 kcal' },
            { name: 'Omega-3', amount: '1 kapsül', calories: '10 kcal' }
          ]
        }
      ],
      additionalInfo: [
        'Supplement: Whey, Casein, Kreatin, Omega-3',
        'Öğün zamanları antrenman programına göre',
        'Makro takibi hassas yapılmalı',
        'Yemek saatleri değişmemeli'
      ]
    },
    {
      id: 'advanced-b',
      name: 'Cut Mode - Yarışma Diyeti',
      description: 'Vücut geliştirme yarışması için tasarlanmış yağ yakım diyeti. Maksimum kas koruma ile yağ kaybı.',
      duration: '12-20 hafta',
      level: 'advanced',
      mealsPerDay: 6,
      targetGoals: ['Yağ Yakımı', 'Kas Koruma', 'Tanım', 'Yarışma Hazırlığı'],
      macros: {
        protein: '45%',
        carbs: '25%',
        fat: '30%'
      },
      dailyPlan: [
        {
          mealTime: 'Meal 1 (06:00)',
          foods: [
            { name: 'Yumurta akı', amount: '8 adet', calories: '135 kcal' },
            { name: 'Yulaf', amount: '40g', calories: '150 kcal' },
            { name: 'Kahve (sade)', amount: '1 büyük', calories: '5 kcal' }
          ]
        },
        {
          mealTime: 'Meal 2 (09:00)',
          foods: [
            { name: 'Whey protein', amount: '30g', calories: '120 kcal' },
            { name: 'Yeşil elma', amount: '1 orta', calories: '80 kcal' }
          ]
        },
        {
          mealTime: 'Meal 3 (12:00)',
          foods: [
            { name: 'Tavuk göğsü (yağsız)', amount: '200g', calories: '330 kcal' },
            { name: 'Pirinç', amount: '50g (kuru)', calories: '180 kcal' },
            { name: 'Yeşil sebze', amount: '300g', calories: '60 kcal' }
          ]
        },
        {
          mealTime: 'Meal 4 (15:00)',
          foods: [
            { name: 'Protein tozu', amount: '30g', calories: '120 kcal' },
            { name: 'Kabak', amount: '200g', calories: '30 kcal' }
          ]
        },
        {
          mealTime: 'Meal 5 (18:00)',
          foods: [
            { name: 'Hindi göğsü', amount: '150g', calories: '200 kcal' },
            { name: 'Brokoli + karnabahar', amount: '250g', calories: '50 kcal' },
            { name: 'Zeytinyağı', amount: '1 tatlı kaşığı', calories: '40 kcal' }
          ]
        },
        {
          mealTime: 'Meal 6 (21:00)',
          foods: [
            { name: 'Casein protein', amount: '30g', calories: '110 kcal' },
            { name: 'Salatalık', amount: 'sınırsız', calories: '20 kcal' }
          ]
        }
      ],
      additionalInfo: [
        'Kalori açığı: -500 kcal',
        'Karbonhidrat: 50-100g/gün',
        'Su: 4L+ (elektrolit dengesi önemli)',
        'Hassas gramaj ve takip gerekli',
        'Kardiyo: 30-45 dk düşük tempo'
      ]
    }
  ];

  const levels = [
    { key: 'all' as const, name: 'Tümü', color: 'bg-gray-600' },
    { key: 'beginner' as const, name: 'Başlangıç', color: 'bg-green-600' },
    { key: 'intermediate' as const, name: 'Orta Seviye', color: 'bg-yellow-600' },
    { key: 'advanced' as const, name: 'İleri Seviye', color: 'bg-red-600' }
  ];

  const filteredPlans = selectedLevel === 'all' 
    ? nutritionPlans 
    : nutritionPlans.filter(plan => plan.level === selectedLevel);

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Başlangıç';
      case 'intermediate': return 'Orta Seviye';
      case 'advanced': return 'İleri Seviye';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              🥗 Beslenme Planları
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-green-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Seviyenize uygun profesyonel beslenme planları ile hedeflerinize ulaşın
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {levels.map((level) => (
            <button
              key={level.key}
              onClick={() => setSelectedLevel(level.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedLevel === level.key
                  ? `${level.color} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>

        {/* Nutrition Plans Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(plan.level)}`}>
                      {getLevelText(plan.level)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Süre: {plan.duration}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {plan.mealsPerDay} öğün/gün
                    </div>
                    
                    {plan.macros && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Makrolar:</span> P:{plan.macros.protein} K:{plan.macros.carbs} Y:{plan.macros.fat}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {plan.targetGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => openPlanDetail(plan)}
                    className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Plan Detayları
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Henüz plan yok</h3>
              <p className="mt-2 text-gray-500">Bu seviye için henüz beslenme planı eklenmemiş.</p>
            </div>
          </div>
        )}
      </div>

      {/* Nutrition Plan Detail Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLevelBadgeColor(selectedPlan.level)}`}>
                  {getLevelText(selectedPlan.level)}
                </span>
              </div>
              <button
                onClick={closePlanDetail}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Plan Info */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Süre
                    </div>
                    <div className="font-semibold text-gray-900">{selectedPlan.duration}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Öğün Sayısı
                    </div>
                    <div className="font-semibold text-gray-900">{selectedPlan.mealsPerDay} öğün/gün</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hedefler
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPlan.targetGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Macros */}
                {selectedPlan.macros && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Makro Besin Dağılımı</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">Protein</div>
                        <div className="text-sm text-gray-600">{selectedPlan.macros.protein}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">Karbonhidrat</div>
                        <div className="text-sm text-gray-600">{selectedPlan.macros.carbs}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">Yağ</div>
                        <div className="text-sm text-gray-600">{selectedPlan.macros.fat}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Daily Plan */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Günlük Beslenme Planı</h3>
                
                {selectedPlan.dailyPlan.map((meal, mealIndex) => (
                  <div key={mealIndex} className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-4">{meal.mealTime}</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 font-medium text-gray-900">Besin</th>
                            <th className="text-center p-3 font-medium text-gray-900">Miktar</th>
                            <th className="text-center p-3 font-medium text-gray-900">Kalori</th>
                            <th className="text-left p-3 font-medium text-gray-900">Not</th>
                          </tr>
                        </thead>
                        <tbody>
                          {meal.foods.map((food, foodIndex) => (
                            <tr key={foodIndex} className="border-t">
                              <td className="p-3 font-medium text-gray-900">{food.name}</td>
                              <td className="p-3 text-center text-gray-700">{food.amount}</td>
                              <td className="p-3 text-center text-gray-700">{food.calories || '-'}</td>
                              <td className="p-3 text-gray-600">{food.notes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Önemli Notlar</h4>
                <ul className="space-y-2">
                  {selectedPlan.additionalInfo.map((info, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {info}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={closePlanDetail}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    alert(`${selectedPlan.name} planına başladınız!`);
                    closePlanDetail();
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Bu Planı Başlat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition; 