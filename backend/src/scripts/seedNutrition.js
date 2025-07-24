const mongoose = require('mongoose');
const config = require('../config/db');
const Nutrition = require('../models/Nutrition');

const nutritionPlans = [
  {
    name: 'Protein Yüklü Kahvaltı',
    description: 'Kas gelişimi için protein açısından zengin kahvaltı',
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 20,
    ingredients: [
      'yumurta',
      'yulaf',
      'süt',
      'badem',
      'muz'
    ],
    targetGoals: ['muscle_gain'],
    mealType: 'breakfast',
    preparationTime: 15,
    difficulty: 'easy'
  },
  {
    name: 'Hafif Akşam Yemeği',
    description: 'Kilo vermeye yardımcı düşük kalorili akşam yemeği',
    calories: 350,
    protein: 25,
    carbs: 35,
    fat: 12,
    ingredients: [
      'tavuk göğsü',
      'kinoa',
      'brokoli',
      'zeytinyağı',
      'limon'
    ],
    targetGoals: ['weight_loss'],
    mealType: 'dinner',
    preparationTime: 25,
    difficulty: 'medium'
  },
  {
    name: 'Sporcu Öğle Yemeği',
    description: 'Antrenman sonrası toparlanma için ideal öğle yemeği',
    calories: 550,
    protein: 40,
    carbs: 65,
    fat: 15,
    ingredients: [
      'ton balığı',
      'kahverengi pirinç',
      'avokado',
      'nohut',
      'ıspanak'
    ],
    targetGoals: ['endurance', 'muscle_gain'],
    mealType: 'lunch',
    preparationTime: 20,
    difficulty: 'medium'
  },
  {
    name: 'Sağlıklı Atıştırmalık',
    description: 'Gün içi enerji için besleyici atıştırmalık',
    calories: 200,
    protein: 10,
    carbs: 25,
    fat: 8,
    ingredients: [
      'yoğurt',
      'granola',
      'çilek',
      'bal',
      'chia tohumu'
    ],
    targetGoals: ['maintenance'],
    mealType: 'snack',
    preparationTime: 5,
    difficulty: 'easy'
  },
  {
    name: 'Vejetaryen Öğle Yemeği',
    description: 'Bitkisel protein kaynakları ile doyurucu öğle yemeği',
    calories: 400,
    protein: 20,
    carbs: 45,
    fat: 18,
    ingredients: [
      'mercimek',
      'kinoa',
      'kırmızı biber',
      'kabak',
      'badem'
    ],
    targetGoals: ['weight_loss', 'maintenance'],
    mealType: 'lunch',
    preparationTime: 30,
    difficulty: 'medium'
  }
];

async function seedNutrition() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut nutrition verilerini temizle
    await Nutrition.deleteMany({});
    console.log('Mevcut nutrition verileri temizlendi');

    // Yeni nutrition verilerini ekle
    const createdNutrition = await Nutrition.insertMany(nutritionPlans);
    console.log(`${createdNutrition.length} adet nutrition planı eklendi`);

    // Bağlantıyı kapat
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');

    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

// Script'i çalıştır
seedNutrition(); 