const mongoose = require('mongoose');
const config = require('../config/db');
const Workout = require('../models/Workout');

const workouts = [
  {
    name: 'Başlangıç Seviyesi Antrenman Programı',
    description: 'Yeni başlayanlar için temel egzersizlerden oluşan tam vücut antrenman programı.',
    type: 'strength',
    difficultyLevel: 'beginner',
    daysPerWeek: 3,
    targetGoals: ['strength', 'muscle_gain'],
    estimatedTime: 45,
    caloriesBurn: 300,
    workoutDays: [
      {
        name: 'Gün 1',
        exercises: [
          { name: 'Vücut Ağırlığı Squat', sets: 3, reps: '12', notes: 'Yavaş ve kontrollü' },
          { name: 'Dumbbell Bench Press', sets: 3, reps: '10', notes: 'Hafif ağırlıkla başla' },
          { name: 'Lat Pulldown', sets: 3, reps: '10', notes: 'Omuzlar geriye' },
          { name: 'Plank', sets: 3, reps: '30 sn', notes: 'Düz pozisyonda tut' }
        ]
      },
      {
        name: 'Gün 2',
        exercises: [
          { name: 'Lunges', sets: 3, reps: '10 her bacak', notes: 'Dengeli hareket et' },
          { name: 'Push-Up', sets: 3, reps: '8', notes: 'Modifiye yapılabilir' },
          { name: 'Seated Row', sets: 3, reps: '10', notes: 'Sırtı dik tut' },
          { name: 'Leg Raise', sets: 3, reps: '12', notes: 'Kontrollü in' }
        ]
      },
      {
        name: 'Gün 3',
        exercises: [
          { name: 'Leg Press', sets: 3, reps: '10', notes: 'Ayaklar omuz genişliğinde' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10', notes: 'Göğüs üst kısmına odaklan' },
          { name: 'Barfiks (yardımlı)', sets: 3, reps: '6', notes: 'Elastik bant kullan' },
          { name: 'Russian Twist', sets: 3, reps: '20', notes: 'Her iki tarafa' }
        ]
      }
    ]
  },
  {
    name: 'Orta Seviye Antrenman Programı',
    description: 'Temel fitness seviyesine sahip sporcular için gelişmiş antrenman programı.',
    type: 'strength',
    difficultyLevel: 'intermediate',
    daysPerWeek: 5,
    targetGoals: ['muscle_gain', 'strength'],
    estimatedTime: 60,
    caloriesBurn: 450,
    workoutDays: [
      {
        name: 'Gün 1 (Göğüs/Ön Kol)',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '10', notes: 'Progresif yüklenme' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10', notes: 'Tam hareket açısı' },
          { name: 'Cable Crossover', sets: 3, reps: '12', notes: 'Squeeze hareketi' },
          { name: 'Barbell Curl', sets: 3, reps: '10', notes: 'Sıkı form' },
          { name: 'Hammer Curl', sets: 3, reps: '10', notes: 'İzole hareket' }
        ]
      },
      {
        name: 'Gün 2 (Sırt/Arka Kol)',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '6', notes: 'Teknik öncelikli' },
          { name: 'Lat Pulldown', sets: 4, reps: '10', notes: 'Geniş tutuş' },
          { name: 'Cable Row', sets: 4, reps: '10', notes: 'Sıkı çekiş' },
          { name: 'Triceps Pushdown', sets: 3, reps: '12', notes: 'Dirsekler sabit' },
          { name: 'Overhead Dumbbell Extension', sets: 3, reps: '10', notes: 'Tam hareket' }
        ]
      },
      {
        name: 'Gün 3 (Bacak/Omuz)',
        exercises: [
          { name: 'Squat', sets: 4, reps: '8', notes: 'Derin squat' },
          { name: 'Leg Extension', sets: 3, reps: '12', notes: 'Tepe noktada tut' },
          { name: 'Lying Leg Curl', sets: 3, reps: '12', notes: 'Kontrollü hareket' },
          { name: 'Military Press', sets: 3, reps: '10', notes: 'Strict form' },
          { name: 'Lateral Raise', sets: 3, reps: '12', notes: 'Hafif ağırlık' }
        ]
      },
      {
        name: 'Gün 4 (Karın)',
        exercises: [
          { name: 'Plank', sets: 3, reps: '45 sn', notes: 'Kalça seviyesi' },
          { name: 'Leg Raise', sets: 3, reps: '15', notes: 'Yavaş tempo' },
          { name: 'Cable Crunch', sets: 3, reps: '12', notes: 'Tam büzülme' },
          { name: 'Mountain Climbers', sets: 3, reps: '30 sn', notes: 'Hızlı tempo' }
        ]
      },
      {
        name: 'Gün 5 (Full Body)',
        exercises: [
          { name: 'Barbell Complex', sets: 3, reps: 'Squat + Row + Push Press', notes: 'Dinlenme yok' },
          { name: 'Push-Up', sets: 3, reps: '15', notes: 'Patlayıcı yukarı' },
          { name: 'Pull-Up', sets: 3, reps: '6', notes: 'Tam açı' },
          { name: 'Jump Squat', sets: 3, reps: '12', notes: 'Patlayıcı sıçrama' }
        ]
      }
    ]
  },
  {
    name: 'İleri Seviye Antrenman Programı',
    description: 'Deneyimli sporcular için yoğun ve zorlu antrenman programı.',
    type: 'strength',
    difficultyLevel: 'advanced',
    daysPerWeek: 6,
    targetGoals: ['strength', 'muscle_gain'],
    estimatedTime: 75,
    caloriesBurn: 600,
    workoutDays: [
      {
        name: 'Gün 1 (Push)',
        exercises: [
          { name: 'Bench Press', sets: 5, reps: '6', notes: 'Ağır yük' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10', notes: 'Dropset son set' },
          { name: 'Overhead Press', sets: 4, reps: '10', notes: 'Strict form' },
          { name: 'Skull Crusher', sets: 4, reps: '12', notes: 'Dirsek sabit' }
        ]
      },
      {
        name: 'Gün 2 (Pull)',
        exercises: [
          { name: 'Weighted Pull-Up', sets: 4, reps: '8', notes: 'Ağırlık ekle' },
          { name: 'T-Bar Row', sets: 4, reps: '10', notes: 'Dar tutuş' },
          { name: 'Face Pull', sets: 3, reps: '15', notes: 'Yüksek çekiş' },
          { name: 'Barbell Curl', sets: 4, reps: '12', notes: '21 tekniği' }
        ]
      },
      {
        name: 'Gün 3 (Leg)',
        exercises: [
          { name: 'Back Squat', sets: 5, reps: '8', notes: 'Pyramid set' },
          { name: 'Romanian Deadlift', sets: 4, reps: '10', notes: 'Ağır yük' },
          { name: 'Walking Lunge', sets: 3, reps: '12', notes: 'Dumbbell ile' },
          { name: 'Standing Calf Raise', sets: 4, reps: '15', notes: 'Tepe noktada tut' }
        ]
      },
      {
        name: 'Gün 4 (Push)',
        exercises: [
          { name: 'Machine Chest Press', sets: 4, reps: '10', notes: 'Pre-exhaust' },
          { name: 'Dumbbell Shoulder Press', sets: 4, reps: '10', notes: 'Arnold press' },
          { name: 'Triceps Dips', sets: 3, reps: '12', notes: 'Vücut ağırlığı' },
          { name: 'Lateral Raise', sets: 4, reps: '15', notes: 'Partial rep finisher' }
        ]
      },
      {
        name: 'Gün 5 (Pull)',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5', notes: 'Max effort' },
          { name: 'Lat Pulldown', sets: 4, reps: '10', notes: 'Behind neck' },
          { name: 'Reverse Curl', sets: 3, reps: '12', notes: 'Önkol odaklı' },
          { name: 'Seated Cable Row', sets: 3, reps: '12', notes: 'Close grip' }
        ]
      },
      {
        name: 'Gün 6 (Leg)',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '8', notes: 'Clean grip' },
          { name: 'Hip Thrust', sets: 4, reps: '10', notes: 'Ağır yük' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10', notes: 'Her bacak' },
          { name: 'Donkey Calf Raise', sets: 3, reps: '15', notes: 'Makine ile' }
        ]
      }
    ]
  }
];

const seedWorkouts = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('MongoDB bağlantısı başarılı.');

    await Workout.deleteMany({});
    console.log('Mevcut antrenmanlar silindi.');

    const createdWorkouts = await Workout.create(workouts);
    console.log('Yeni antrenmanlar eklendi:', createdWorkouts.length);

    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı.');
  } catch (error) {
    console.error('Antrenman yükleme hatası:', error);
    process.exit(1);
  }
};

seedWorkouts(); 