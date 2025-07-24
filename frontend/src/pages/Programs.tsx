import React, { useState } from 'react';
import Header from '../components/Header';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  workoutsPerWeek: number;
  targetGoals: string[];
  exercises: {
    day: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }[];
  }[];
}

const Programs: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProgramDetail = (program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeProgramDetail = () => {
    setSelectedProgram(null);
    setIsModalOpen(false);
  };

  // Programlar burada tanımlanacak
  const programs: Program[] = [
    // Başlangıç Seviyesi Programları
    {
      id: 'beginner-a',
      name: 'Başlangıç Programı A',
      description: 'Yeni başlayanlar için 3 günlük full body antrenman programı. Temel hareketlerle tüm vücut kaslarını çalıştırır.',
      duration: '4-6 hafta',
      level: 'beginner',
      workoutsPerWeek: 3,
      targetGoals: ['Kas Kazanma', 'Kuvvet', 'Genel Kondisyon'],
      exercises: [
        {
          day: '1. Gün (Full Body 1)',
          exercises: [
            { name: 'Goblet Squat', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Dumbbell Chest Press', sets: 3, reps: '10', rest: '60 sn' },
            { name: 'Bent Over Dumbbell Row', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Plank', sets: 3, reps: '30 sn', rest: '30 sn' }
          ]
        },
        {
          day: '2. Gün (Full Body 2)',
          exercises: [
            { name: 'Bodyweight Lunge', sets: 3, reps: '10 (her bacak)', rest: '60 sn' },
            { name: 'Incline Push-up', sets: 3, reps: '10', rest: '60 sn' },
            { name: 'Lat Pulldown', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Dead Bug', sets: 3, reps: '12', rest: '30 sn' }
          ]
        },
        {
          day: '3. Gün (Full Body 3)',
          exercises: [
            { name: 'Leg Press', sets: 3, reps: '10', rest: '60 sn' },
            { name: 'Dumbbell Shoulder Press', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Seated Row', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Russian Twist', sets: 3, reps: '20', rest: '30 sn' }
          ]
        }
      ]
    },
    {
      id: 'beginner-b',
      name: 'Başlangıç Programı B',
      description: '4 günlük split antrenman programı. Kas gruplarını ayrı günlerde çalıştırarak daha detaylı gelişim sağlar.',
      duration: '6-8 hafta',
      level: 'beginner',
      workoutsPerWeek: 4,
      targetGoals: ['Kas Kazanma', 'Vücut Şekillendirme', 'Kuvvet'],
      exercises: [
        {
          day: '1. Gün: Göğüs + Triceps',
          exercises: [
            { name: 'Chest Press', sets: 3, reps: '10', rest: '60 sn' },
            { name: 'Incline Dumbbell Fly', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Triceps Pushdown', sets: 3, reps: '12', rest: '45 sn' }
          ]
        },
        {
          day: '2. Gün: Sırt + Biceps',
          exercises: [
            { name: 'Lat Pulldown', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Seated Row', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Dumbbell Curl', sets: 3, reps: '10', rest: '45 sn' }
          ]
        },
        {
          day: '3. Gün: Bacak',
          exercises: [
            { name: 'Leg Press', sets: 3, reps: '12', rest: '90 sn' },
            { name: 'Walking Lunge', sets: 3, reps: '10', rest: '60 sn' },
            { name: 'Calf Raise', sets: 3, reps: '15', rest: '45 sn' }
          ]
        },
        {
          day: '4. Gün: Omuz + Karın',
          exercises: [
            { name: 'Shoulder Press', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Lateral Raise', sets: 3, reps: '15', rest: '45 sn' },
            { name: 'Bicycle Crunch', sets: 3, reps: '30 sn', rest: '30 sn' }
          ]
        }
      ]
    },
    // Orta Seviye Programları
    {
      id: 'intermediate-a',
      name: 'Orta Seviye Programı A',
      description: '6 günlük Push/Pull/Legs split programı. Daha yoğun antrenmanlar ve gelişmiş egzersizlerle kas gelişimini maksimize eder.',
      duration: '8-12 hafta',
      level: 'intermediate',
      workoutsPerWeek: 6,
      targetGoals: ['Kas Kazanma', 'Kuvvet Artışı', 'Hipertrofi'],
      exercises: [
        {
          day: '1. Gün: Push (Göğüs, Omuz, Triceps)',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '8', rest: '90 sn' },
            { name: 'Overhead Press', sets: 4, reps: '10', rest: '90 sn' },
            { name: 'Triceps Dips', sets: 3, reps: '10', rest: '60 sn' }
          ]
        },
        {
          day: '2. Gün: Pull (Sırt, Biceps)',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: '6', rest: '120 sn' },
            { name: 'Pull-up (destekli olabilir)', sets: 3, reps: 'max', rest: '90 sn' },
            { name: 'Barbell Curl', sets: 3, reps: '10', rest: '60 sn' }
          ]
        },
        {
          day: '3. Gün: Legs',
          exercises: [
            { name: 'Squat', sets: 4, reps: '8', rest: '120 sn' },
            { name: 'Leg Curl', sets: 3, reps: '12', rest: '60 sn' },
            { name: 'Calf Raise', sets: 3, reps: '20', rest: '45 sn' }
          ]
        },
        {
          day: '4. Gün: Push (Varyasyon)',
          exercises: [
            { name: 'Incline Dumbbell Press', sets: 4, reps: '10', rest: '90 sn' },
            { name: 'Lateral Raises', sets: 4, reps: '12', rest: '60 sn' },
            { name: 'Close Grip Bench Press', sets: 3, reps: '10', rest: '75 sn' }
          ]
        },
        {
          day: '5. Gün: Pull (Varyasyon)',
          exercises: [
            { name: 'Bent Over Row', sets: 4, reps: '8', rest: '90 sn' },
            { name: 'Cable Row', sets: 3, reps: '12', rest: '75 sn' },
            { name: 'Hammer Curl', sets: 3, reps: '12', rest: '60 sn' }
          ]
        },
        {
          day: '6. Gün: Legs (Varyasyon)',
          exercises: [
            { name: 'Bulgarian Split Squat', sets: 3, reps: '10', rest: '90 sn' },
            { name: 'Romanian Deadlift', sets: 4, reps: '10', rest: '90 sn' },
            { name: 'Seated Calf Raise', sets: 3, reps: '15', rest: '45 sn' }
          ]
        }
      ]
    },
    {
      id: 'intermediate-b',
      name: 'Orta Seviye Programı B',
      description: '4 günlük Upper/Lower split programı. Üst ve alt vücut günlerini ayırarak dengeli kas gelişimi sağlar.',
      duration: '6-10 hafta',
      level: 'intermediate',
      workoutsPerWeek: 4,
      targetGoals: ['Hipertrofi', 'Kuvvet', 'Kas Şekillendirme'],
      exercises: [
        {
          day: '1. Gün: Upper',
          exercises: [
            { name: 'Incline Bench Press', sets: 4, reps: '10', rest: '90 sn' },
            { name: 'Seated Row', sets: 4, reps: '12', rest: '75 sn' },
            { name: 'Arnold Press', sets: 3, reps: '12', rest: '60 sn' }
          ]
        },
        {
          day: '2. Gün: Lower',
          exercises: [
            { name: 'Romanian Deadlift', sets: 4, reps: '10', rest: '120 sn' },
            { name: 'Walking Lunge', sets: 3, reps: '10', rest: '90 sn' },
            { name: 'Leg Extension', sets: 3, reps: '15', rest: '60 sn' }
          ]
        },
        {
          day: '3. Gün: Upper (farklı açılar)',
          exercises: [
            { name: 'Cable Fly', sets: 3, reps: '15', rest: '60 sn' },
            { name: 'Lat Pulldown', sets: 3, reps: '12', rest: '75 sn' },
            { name: 'Dumbbell Lateral Raise', sets: 3, reps: '20', rest: '45 sn' }
          ]
        },
        {
          day: '4. Gün: Lower',
          exercises: [
            { name: 'Front Squat', sets: 4, reps: '8', rest: '120 sn' },
            { name: 'Leg Curl', sets: 3, reps: '12', rest: '75 sn' },
            { name: 'Standing Calf Raise', sets: 3, reps: '25', rest: '45 sn' }
          ]
        }
      ]
    },
    // İleri Seviye Programları
    {
      id: 'advanced-a',
      name: 'İleri Seviye Programı A',
      description: '5 günlük split programı. Her kas grubuna odaklanarak maksimum gelişim ve kuvvet artışı sağlar. Deneyimli sporcular için.',
      duration: '12-16 hafta',
      level: 'advanced',
      workoutsPerWeek: 5,
      targetGoals: ['Maksimum Kuvvet', 'Hipertrofi', 'İleri Kas Geliştirme'],
      exercises: [
        {
          day: '1. Gün: Göğüs',
          exercises: [
            { name: 'Bench Press', sets: 5, reps: '6', rest: '120 sn' },
            { name: 'Incline Dumbbell Press', sets: 4, reps: '8', rest: '90 sn' },
            { name: 'Chest Fly', sets: 4, reps: '12', rest: '75 sn' }
          ]
        },
        {
          day: '2. Gün: Sırt',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: '5', rest: '150 sn' },
            { name: 'T-Bar Row', sets: 4, reps: '10', rest: '90 sn' },
            { name: 'Face Pull', sets: 3, reps: '20', rest: '60 sn' }
          ]
        },
        {
          day: '3. Gün: Bacak',
          exercises: [
            { name: 'Squat', sets: 5, reps: '5', rest: '150 sn' },
            { name: 'Hack Squat', sets: 4, reps: '10', rest: '120 sn' },
            { name: 'Calf Raise', sets: 5, reps: '25', rest: '45 sn' }
          ]
        },
        {
          day: '4. Gün: Omuz',
          exercises: [
            { name: 'Overhead Press', sets: 4, reps: '8', rest: '120 sn' },
            { name: 'Dumbbell Lateral Raise', sets: 4, reps: '15', rest: '60 sn' },
            { name: 'Rear Delt Machine', sets: 3, reps: '20', rest: '45 sn' }
          ]
        },
        {
          day: '5. Gün: Kol (Biceps + Triceps)',
          exercises: [
            { name: 'Barbell Curl', sets: 4, reps: '10', rest: '75 sn' },
            { name: 'Skullcrusher', sets: 4, reps: '10', rest: '75 sn' },
            { name: 'Cable Curl + Pushdown Superset', sets: 3, reps: '15', rest: '90 sn' }
          ]
        }
      ]
    },
    {
      id: 'advanced-b',
      name: 'İleri Seviye Programı B',
      description: '6 günlük yoğun PPL programı. Kardiyo entegrasyonu ve gelişmiş tekniklerin yer aldığı kapsamlı antrenman sistemi.',
      duration: '10-14 hafta',
      level: 'advanced',
      workoutsPerWeek: 6,
      targetGoals: ['Kondisyon', 'Hipertrofi', 'Yağ Yakımı', 'Performans'],
      exercises: [
        {
          day: '1. Gün: Push',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: '120 sn' },
            { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '90 sn' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '75 sn' },
            { name: 'Triceps Dips', sets: 3, reps: '12-15', rest: '60 sn' }
          ]
        },
        {
          day: '2. Gün: Pull',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: '5-6', rest: '150 sn' },
            { name: 'Pull-ups', sets: 4, reps: 'max', rest: '90 sn' },
            { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90 sn' },
            { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60 sn' }
          ]
        },
        {
          day: '3. Gün: Legs + HIIT',
          exercises: [
            { name: 'Back Squat', sets: 4, reps: '6-8', rest: '120 sn' },
            { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '90 sn' },
            { name: 'Bulgarian Split Squat', sets: 3, reps: '10', rest: '75 sn' },
            { name: '20 dk HIIT Kardiyo', sets: 1, reps: '20 dk', rest: 'Bitir' }
          ]
        },
        {
          day: '4. Gün: Push (Farklı Açı/Tempo)',
          exercises: [
            { name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '90 sn' },
            { name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', rest: '60 sn' },
            { name: 'Cable Lateral Raise', sets: 3, reps: '15-20', rest: '45 sn' },
            { name: 'Close Grip Bench Press', sets: 3, reps: '10-12', rest: '75 sn' }
          ]
        },
        {
          day: '5. Gün: Pull + Core',
          exercises: [
            { name: 'T-Bar Row', sets: 4, reps: '8-10', rest: '90 sn' },
            { name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '75 sn' },
            { name: 'Cable Row', sets: 3, reps: '12-15', rest: '60 sn' },
            { name: 'Plank to Push-up', sets: 3, reps: '15', rest: '45 sn' },
            { name: 'Russian Twist', sets: 3, reps: '30', rest: '30 sn' }
          ]
        },
        {
          day: '6. Gün: Legs + LISS',
          exercises: [
            { name: 'Front Squat', sets: 4, reps: '8-10', rest: '90 sn' },
            { name: 'Leg Press', sets: 4, reps: '12-15', rest: '75 sn' },
            { name: 'Walking Lunge', sets: 3, reps: '12', rest: '60 sn' },
            { name: '30 dk LISS Yürüyüş', sets: 1, reps: '30 dk', rest: 'Bitir' }
          ]
        }
      ]
    }
  ];

  const levels = [
    { key: 'all' as const, name: 'Tümü', color: 'bg-gray-600' },
    { key: 'beginner' as const, name: 'Başlangıç', color: 'bg-green-600' },
    { key: 'intermediate' as const, name: 'Orta Seviye', color: 'bg-yellow-600' },
    { key: 'advanced' as const, name: 'İleri Seviye', color: 'bg-red-600' }
  ];

  const filteredPrograms = selectedLevel === 'all' 
    ? programs 
    : programs.filter(program => program.level === selectedLevel);

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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Antrenman Programları
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-primary-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Seviyenize uygun profesyonel antrenman programları ile hedeflerinize ulaşın
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

        {/* Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(program.level)}`}>
                      {getLevelText(program.level)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Süre: {program.duration}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {program.workoutsPerWeek} antrenman/hafta
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {program.targetGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-lg"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => openProgramDetail(program)}
                    className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Program Detayları
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">Henüz program yok</h3>
              <p className="mt-2 text-gray-500">Bu seviye için henüz program eklenmemiş.</p>
            </div>
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {isModalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLevelBadgeColor(selectedProgram.level)}`}>
                  {getLevelText(selectedProgram.level)}
                </span>
              </div>
              <button
                onClick={closeProgramDetail}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Program Info */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Süre
                    </div>
                    <div className="font-semibold text-gray-900">{selectedProgram.duration}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Frekans
                    </div>
                    <div className="font-semibold text-gray-900">{selectedProgram.workoutsPerWeek} gün/hafta</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hedefler
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedProgram.targetGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-lg"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Antrenman Programı</h3>
                
                {selectedProgram.exercises.map((day, dayIndex) => (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-4">{day.day}</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 font-medium text-gray-900">Egzersiz</th>
                            <th className="text-center p-3 font-medium text-gray-900">Set</th>
                            <th className="text-center p-3 font-medium text-gray-900">Tekrar</th>
                            <th className="text-center p-3 font-medium text-gray-900">Dinlenme</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <tr key={exerciseIndex} className="border-t">
                              <td className="p-3 font-medium text-gray-900">{exercise.name}</td>
                              <td className="p-3 text-center text-gray-700">{exercise.sets}</td>
                              <td className="p-3 text-center text-gray-700">{exercise.reps}</td>
                              <td className="p-3 text-center text-gray-700">{exercise.rest}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={closeProgramDetail}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    // Bu programa başla fonksiyonalitesi eklenebilir
                    alert(`${selectedProgram.name} programına başladınız!`);
                    closeProgramDetail();
                  }}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Bu Programı Başlat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs; 