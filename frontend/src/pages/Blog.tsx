import React, { useState } from 'react';
import Header from '../components/Header';
import NewsletterSubscription from '../components/NewsletterSubscription';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  image: string;
  featured: boolean;
  likes: number;
  comments: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openPostDetail = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Yeni Başlayanlar İçin Doğru Antrenman Rehberi',
      excerpt: 'Spor salonuna ilk kez gidecekler için kapsamlı rehber. Temel hareketler, program düzeni ve motivasyon ipuçları.',
      content: `Spor salonuna ilk kez adım atmak hem heyecan verici hem de biraz korkutucu olabilir. Bu rehber ile doğru başlangıç yapacaksınız.

## Temel Prensipler

### 1. Küçük Adımlarla Başlayın
İlk hafta vücudunuzu alıştırmak için haftada 3 gün yeterli. Her seans 45-60 dakika arasında olmalı.

### 2. Temel Hareketlere Odaklanın
- **Squat**: Bacak ve kalça kasları için
- **Deadlift**: Tüm vücut için güçlü hareket
- **Bench Press**: Göğüs ve kol kasları
- **Pull-up**: Sırt kasları için

### 3. Form Tekniği Öncelikli
Ağırlık arttırmak yerine doğru form ile çalışın. Yanlış teknik sakatlık riski yaratır.

## İlk 4 Haftalık Program

**1. Hafta**: Vücut ağırlığı egzersizleri
**2. Hafta**: Hafif ağırlıklar ekleme
**3. Hafta**: Set sayısını artırma
**4. Hafta**: Ağırlık ve yoğunluk artışı

## Motivasyon İpuçları

- Hedeflerinizi yazın
- İlerlemenizi kaydedin
- Sabırlı olun, sonuçlar zaman alır
- Antrenman arkadaşı bulun

Unutmayın, en önemli şey düzenli olmak. Mükemmel antrenman yapmaya çalışmak yerine tutarlı olmaya odaklanın.`,
      author: {
        name: 'Mehmet Ali Doğan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Fitness uzmanı ve FitPlanner kurucusu'
      },
      category: 'Antrenman',
      tags: ['Başlangıç', 'Rehber', 'Spor Salonu'],
      publishDate: '2024-01-15',
      readTime: 8,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      featured: true,
      likes: 124,
      comments: 15
    },
    {
      id: '2',
      title: 'Metabolizmayı Hızlandıran 10 Süper Besin',
      excerpt: 'Doğal yöntemlerle metabolizmanızı hızlandırarak yağ yakımını artıracak besinleri keşfedin.',
      content: `Metabolizma hızınızı artırmak için doğru besinleri seçmek çok önemli. İşte metabolizmanızı boost edecek süper besinler:

## En Etkili 10 Besin

### 1. Yeşil Çay
- Kateşin içeriği yağ yakımını %4-5 artırır
- Günde 3-4 bardak tüketin
- Antrenman öncesi özellikle etkili

### 2. Acı Biber
- Kapsaisin metabolizmayı geçici olarak hızlandırır
- Termal etkisi sayesinde kalori yakımı artar
- Öğünlere ekleyerek tüketin

### 3. Protein Açısından Zengin Besinler
- **Tavuk göğsü**: Yağsız protein kaynağı
- **Yumurta**: Tam protein profili
- **Balık**: Omega-3 ve protein
- **Baklagiller**: Bitkisel protein

### 4. Soğuk Su
- Vücut suyu ısıtmak için enerji harcar
- Günde 2-3 litre soğuk su için
- Metabolizmanızı %30 artırabilir

### 5. Kahve
- Kafein metabolizmayı %3-11 artırır
- Antrenman öncesi performansı destekler
- Günde 2-3 fincan ideal

## Beslenme Zamanlaması

**Sabah**: Protein + Kompleks karbonhidrat
**Öğle**: Dengeli makro dağılımı
**Akşam**: Protein ağırlıklı + Sebze

## Bonus İpuçları

- Düzenli öğün saatleri
- Ara öğünlerde protein
- Bol su tüketimi
- Yeterli uyku

Bu besinleri düzenli tükettiğinizde 2-3 hafta içinde farkı hissetmeye başlayacaksınız.`,
      author: {
        name: 'Dr. Ayşe Nutritionist',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        bio: 'Beslenme uzmanı, 10 yıl deneyim'
      },
      category: 'Beslenme',
      tags: ['Metabolizma', 'Yağ Yakımı', 'Süper Besinler'],
      publishDate: '2024-01-12',
      readTime: 6,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
      featured: true,
      likes: 89,
      comments: 23
    },
    {
      id: '3',
      title: 'Home Workout: Ekipmansız Antrenman Programı',
      excerpt: 'Hiç ekipman kullanmadan evde yapabileceğiniz etkili 30 dakikalık antrenman programı.',
      content: `Ekipman olmadan evde etkili antrenman yapmak mümkün! İşte 30 dakikalık tam vücut programı:

## 5 Dakika Isınma
- Marş (2 dk)
- Kol çevirme (1 dk)
- Bacak salıncakları (1 dk)
- Dinamik germe (1 dk)

## Ana Antrenman (20 Dakika)

### Tur 1: Alt Vücut (6 dk)
**Her egzersiz 45 sn çalış, 15 sn dinlen**
1. Squat
2. Lunge (sağ bacak)
3. Lunge (sol bacak)
4. Jump Squat
5. Single-leg Deadlift (sağ)
6. Single-leg Deadlift (sol)

### Tur 2: Üst Vücut (7 dk)
1. Push-up
2. Pike Push-up
3. Triceps Dips (sandalye)
4. Mountain Climber
5. Plank
6. Side Plank (sağ)
7. Side Plank (sol)

### Tur 3: Kardiyo HIIT (7 dk)
1. Burpee
2. High Knees
3. Jumping Jacks
4. Russian Twist
5. Bear Crawl
6. Star Jumps
7. Sprint yerinde

## 5 Dakika Soğuma
- Yavaş yürüyüş (2 dk)
- Statik germe (3 dk)

## Haftalık Program
- **Pazartesi**: Tam vücut
- **Salı**: Dinlenme
- **Çarşamba**: Tam vücut
- **Perşembe**: Dinlenme
- **Cuma**: Tam vücut
- **Hafta sonu**: Aktif dinlenme

Bu program ile 4-6 hafta sonunda belirgin gelişim göreceksiniz!`,
      author: {
        name: 'Coach Emre',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: 'Kişisel antrenör, home workout uzmanı'
      },
      category: 'Antrenman',
      tags: ['Home Workout', 'Ekipmansız', 'HIIT'],
      publishDate: '2024-01-10',
      readTime: 5,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      featured: false,
      likes: 156,
      comments: 31
    },
    {
      id: '4',
      title: 'Meal Prep: Haftalık Beslenme Hazırlığı',
      excerpt: 'Zamanından tasarruf ederken sağlıklı beslenmenin püf noktaları ve pratik meal prep önerileri.',
      content: `Meal prep ile hem zamandan tasarruf edin hem de sağlıklı beslenin!

## Meal Prep Temelleri

### Planlama (Pazar)
- Haftalık menü oluşturma
- Alışveriş listesi hazırlama
- Kap ve malzeme kontrolü

### Hazırlık (Pazar/Pazartesi)
- 2-3 saat ayırın
- Tüm sebzeleri yıkayın
- Proteinleri pişirin
- Karbonhidratları hazırlayın

## 5 Günlük Meal Prep Menüsü

### Protein Kaynakları
- **Tavuk göğsü**: Fırında baharatlı
- **Somon**: Izgara
- **Yumurta**: Haşlama
- **Tofu**: Marine edilmiş

### Karbonhidratlar
- **Quinoa**: Sebzeli
- **Tatlı patates**: Fırında
- **Esmer pirinç**: Sade
- **Bulgur**: Domatesli

### Sebzeler
- **Brokoli**: Buharda
- **Havuç**: Çiğ strips
- **Salatalık**: Dilimli
- **Cherry domates**: Çiğ

## Saklama İpuçları

### Cam Kaplar Kullanın
- BPA free
- Mikrodalga uyumlu
- Buzdolabında 4-5 gün

### Dondurucu Dostu
- Çorba ve güveçler
- Pişmiş tahıllar
- Soslar ve dressing'ler

## Haftalık Organizasyon

**Pazar**: Planlama ve alışveriş
**Pazartesi**: 2-3 saatlik prep
**Çarşamba**: Mini prep (sebze)
**Cuma**: Gelecek hafta planı

## Pratik Kombinasyonlar

### Combo 1: Mediterranean
Somon + Quinoa + Karışık sebze

### Combo 2: Asian Style
Tavuk + Esmer pirinç + Wok sebze

### Combo 3: Protein Power
Yumurta + Tatlı patates + Avokado

Meal prep ile sağlıklı beslenme artık çok daha kolay!`,
      author: {
        name: 'Chef Zeynep',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        bio: 'Sağlıklı mutfak uzmanı'
      },
      category: 'Beslenme',
      tags: ['Meal Prep', 'Planlama', 'Sağlıklı Beslenme'],
      publishDate: '2024-01-08',
      readTime: 7,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
      featured: false,
      likes: 203,
      comments: 18
    },
    {
      id: '5',
      title: 'Motivasyon Düştüğünde Yapılacak 7 Şey',
      excerpt: 'Antrenman motivasyonunuz düştüğünde sizi tekrar rayına sokacak pratik stratejiler.',
      content: `Motivasyon düşüklüğü herkesi yaşar. İşte bu durumdan çıkmanın yolları:

## 1. Hedeflerinizi Yeniden Gözden Geçirin

### SMART Hedefler Belirleyin
- **Specific**: Spesifik
- **Measurable**: Ölçülebilir
- **Achievable**: Ulaşılabilir
- **Relevant**: İlgili
- **Time-bound**: Zaman sınırlı

### Görsel Hatırlatıcılar
- Hedef fotoğrafları
- İlerleme grafikleri
- Motivasyon notiları

## 2. Rutininizi Değiştirin

### Yeni Egzersizler Deneyin
- Farklı antrenman stilleri
- Outdoor aktiviteler
- Grup dersleri
- Yeni spor dalları

### Antrenman Saatini Değiştirin
- Sabah erken
- Öğle arası
- Akşam saatleri

## 3. Sosyal Destek Sistemi

### Antrenman Arkadaşı
- Birlikte motivasyon
- Hesap verebilirlik
- Rekabet unsuru

### Online Topluluk
- Sosyal medya grupları
- Fitness uygulamaları
- İlerleme paylaşımı

## 4. Küçük Kazanımları Kutlayın

### Mikro Hedefler
- Haftalık küçük amaçlar
- Günlük başarılar
- Her adımı değerlendirin

### Ödül Sistemi
- Hediye verin kendinize
- Özel aktiviteler planlayın
- Self-care zamanı

## 5. Neden'inizi Hatırlayın

### Derin Motivasyon
- Sağlık hedefleri
- Aile için fit olmak
- Özgüven artışı
- Uzun yaşam

## 6. Profesyonel Yardım

### Kişisel Antrenör
- Özel program
- Teknik düzeltme
- Motivasyon desteği

### Beslenme Uzmanı
- Doğru diyet planı
- Enerji optimizasyonu

## 7. Molayı Kabul Edin

### Aktif Dinlenme
- Hafif yürüyüş
- Yoga/meditasyon
- Masaj ve recovery

Unutmayın: Motivasyon geçicidir, disiplin kalıcıdır. Küçük adımlarla devam edin!`,
      author: {
        name: 'Psikolog Dr. Can',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
        bio: 'Spor psikolojisi uzmanı'
      },
      category: 'Motivasyon',
      tags: ['Motivasyon', 'Psikoloji', 'Başarı'],
      publishDate: '2024-01-05',
      readTime: 9,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      featured: false,
      likes: 167,
      comments: 42
    },
    {
      id: '6',
      title: 'Supplement Rehberi: Neye İhtiyacınız Var?',
      excerpt: 'Hangi supplementlerin gerçekten işe yaradığını ve hangilerinin gereksiz olduğunu öğrenin.',
      content: `Supplement dünyası karmaşık görünebilir. İşte science-based yaklaşım:

## Temel Supplementler

### 1. Protein Tozu
**Ne Zaman**: Antrenman sonrası 30 dk içinde
**Miktar**: 25-30g
**Tür**: Whey protein (hızlı emilim)

### 2. Kreatin Monohydrat
**Faydası**: %15 güç artışı
**Miktar**: Günde 5g
**Zaman**: Herhangi bir saatte

### 3. Vitamin D3
**Eksiklik**: Türkiye'de %80 oranında
**Miktar**: 2000-4000 IU
**Test**: Kan tahlili ile kontrol

### 4. Omega-3
**Kaynak**: Balık yağı
**Miktar**: EPA/DHA 1-2g
**Fayda**: İyileşme ve inflamasyon

## Duruma Göre Supplementler

### Kas Kazanımı İçin
- **HMB**: Kas yıkımını azaltır
- **Leucine**: mTOR aktivasyonu
- **ZMA**: Zinç, Magnezyum, B6

### Yağ Yakımı İçin
- **L-Carnitine**: Yağ oksidasyonu
- **Green Tea Extract**: Metabolizma
- **CLA**: Vücut kompozisyonu

### Performans İçin
- **Beta-Alanine**: Dayanıklılık
- **Citrulline**: Pump ve dayanıklılık
- **Caffeine**: Enerji ve odaklanma

## Gereksiz Supplementler

### ❌ BCAAs
Tam protein varsa gereksiz

### ❌ Testosterone Booster
Genç erkeklerde etkisiz

### ❌ Fat Burner
Kalori açığı olmadan işlemez

### ❌ Multivitamin
Dengeli beslenme yeterli

## Timing Stratejisi

### Pre-Workout (30-45 dk önce)
- Caffeine: 200mg
- Citrulline: 6-8g
- Beta-Alanine: 3-5g

### Post-Workout (0-30 dk)
- Whey protein: 25-30g
- Kreatin: 5g
- Basit karbonhidrat: 30-50g

### Yatmadan Önce
- Casein protein: 25g
- ZMA: 1 porsiyon
- Magnezyum: 400mg

## Bütçe Dostu Seçenekler

**En Önemli 3**:
1. Whey protein
2. Kreatin
3. Vitamin D3

**Toplam Maliyet**: Aylık 150-200 TL

## Güvenlik Uyarıları

- Karaciğer/böbrek sorunu varsa doktor onayı
- Hamileler dikkatli olmalı
- Aşırı doz yapmayın
- Kaliteli markalar seçin

Supplement sihir değildir. %80 beslenme, %20 supplement!`,
      author: {
        name: 'Dr. Sport Nutrition',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
        bio: 'Spor beslenme uzmanı, PhD'
      },
      category: 'Beslenme',
      tags: ['Supplementler', 'Beslenme', 'Performans'],
      publishDate: '2024-01-03',
      readTime: 12,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
      featured: false,
      likes: 198,
      comments: 67
    }
  ];

  const categories = [
    { key: 'all', name: 'Tümü', icon: '📚', count: blogPosts.length },
    { key: 'Antrenman', name: 'Antrenman', icon: '💪', count: blogPosts.filter(p => p.category === 'Antrenman').length },
    { key: 'Beslenme', name: 'Beslenme', icon: '🥗', count: blogPosts.filter(p => p.category === 'Beslenme').length },
    { key: 'Motivasyon', name: 'Motivasyon', icon: '🔥', count: blogPosts.filter(p => p.category === 'Motivasyon').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    const searchMatch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const sampleComments: Comment[] = [
    {
      id: '1',
      author: 'Fitness Sevdalısı',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      content: 'Çok faydalı bir yazı olmuş! Özellikle form tekniği kısmı çok önemli, ben de başlangıçta bu konuda zorlanmıştım.',
      date: '2 gün önce',
      likes: 12
    },
    {
      id: '2',
      author: 'Sporcu Adem',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      content: 'Bu programı deneyeceğim kesinlikle. Home workout konusunda çok iyi bilgiler paylaşmışsınız.',
      date: '1 gün önce',
      likes: 8
    },
    {
      id: '3',
      author: 'Healthy Life',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
      content: 'Meal prep konusunda bu kadar detaylı bilgi bulamıyordum. Teşekkürler!',
      date: '3 saat önce',
      likes: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              📝 FitPlanner Blog
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-purple-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Sağlıklı yaşam, antrenman ve beslenme konularında güncel bilgiler
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.key
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <span className="ml-2 text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === 'all' && searchTerm === '' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">⭐</span>
              Öne Çıkan Yazılar
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Öne Çıkan
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="ml-4 text-sm text-gray-500">{post.readTime} dk okuma</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{new Date(post.publishDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openPostDetail(post)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Devamını Oku
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? 'Tüm Yazılar' : `${categories.find(c => c.key === selectedCategory)?.name} Yazıları`}
            {searchTerm && ` - "${searchTerm}" için sonuçlar`}
          </h2>
          
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime} dk</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-700">{post.author.name}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => openPostDetail(post)}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Yazıyı Oku
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Sonuç bulunamadı</h3>
                <p className="mt-2 text-gray-500">Arama kriterlerinize uygun blog yazısı bulunamadı.</p>
              </div>
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">📬 Blog Güncellemelerini Kaçırma!</h3>
          <p className="text-purple-100 mb-6">Yeni yazılarımızdan haberdar olmak için e-posta listemize katıl</p>
          <NewsletterSubscription />
        </div>
      </div>

      {/* Blog Post Detail Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closePostDetail}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Post Header */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
                    {selectedPost.category}
                  </span>
                  <span className="text-sm text-gray-500">{selectedPost.readTime} dakika okuma</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={selectedPost.author.avatar} 
                      alt={selectedPost.author.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedPost.author.name}</p>
                      <p className="text-sm text-gray-500">{selectedPost.author.bio}</p>
                      <p className="text-xs text-gray-400">{new Date(selectedPost.publishDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {selectedPost.likes}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {selectedPost.comments}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8 pt-6 border-t">
                <button className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Beğen
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Paylaş
                </button>
                <button className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Kaydet
                </button>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Yorumlar ({sampleComments.length})</h3>
                
                {/* Comment Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <textarea
                    placeholder="Yorumunuzu yazın..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  ></textarea>
                  <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Yorum Gönder
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {sampleComments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-start">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{comment.author}</h4>
                            <span className="text-sm text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {comment.likes}
                            </button>
                            <button className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                              Yanıtla
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog; 