import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import ProfilePhotoUpload from './ProfilePhotoUpload';

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | '';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goals: string[];
  profilePhoto: string | null;
}

interface UserProfileProps {
  showHeader?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ showHeader = true }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    age: 25,
    gender: '',
    height: 170,
    weight: 70,
    activityLevel: 'moderately_active',
    goals: [],
    profilePhoto: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const goalOptions = [
    { id: 'weight_loss', label: 'Kilo Vermek' },
    { id: 'muscle_gain', label: 'Kas Kazanmak' },
    { id: 'strength', label: 'Güç Artırmak' },
    { id: 'endurance', label: 'Dayanıklılık' },
    { id: 'flexibility', label: 'Esneklik' },
    { id: 'general_fitness', label: 'Genel Fitness' },
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: 'Hareketsiz (Ofis işi, az egzersiz)' },
    { value: 'lightly_active', label: 'Az Aktif (Hafif egzersiz, 1-3 gün/hafta)' },
    { value: 'moderately_active', label: 'Orta Aktif (Orta egzersiz, 3-5 gün/hafta)' },
    { value: 'very_active', label: 'Çok Aktif (Yoğun egzersiz, 6-7 gün/hafta)' },
    { value: 'extremely_active', label: 'Aşırı Aktif (Çok yoğun egzersiz, günde 2x)' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalChange = (goalId: string) => {
    setProfileData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      // In a real app, you would upload the file to your server here
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePhoto: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setProfileData(prev => ({
        ...prev,
        profilePhoto: null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profil başarıyla güncellendi!');
      setIsEditing(false);
    } catch (err) {
      setError('Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = profileData.height / 100;
    const bmi = profileData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Zayıf', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Fazla Kilolu', color: 'text-yellow-600' };
    return { category: 'Obez', color: 'text-red-600' };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showHeader && <Header />}
      
      <div className={`${showHeader ? 'pt-20' : 'pt-0'} pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-blue-600 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Kullanıcı Profili</h1>
                  <p className="text-primary-100 mt-2">
                    Kişisel bilgilerinizi ve fitness hedeflerinizi yönetin
                  </p>
                </div>
                <Link
                  to="/security"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Güvenlik</span>
                </Link>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{isEditing ? 'Düzenlemeyi İptal Et' : 'Düzenle'}</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Success/Error Messages */}
              {success && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-700 dark:text-green-300">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Profile Photo Section */}
                <div className="flex justify-center">
                  <ProfilePhotoUpload
                    currentPhoto={profileData.profilePhoto || undefined}
                    onPhotoChange={handlePhotoChange}
                  />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                      className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email adresi değiştirilemez
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yaş
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      min="13"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cinsiyet
                    </label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                      <option value="">Seçiniz</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Boy (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={profileData.height}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      min="100"
                      max="250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kilo (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={profileData.weight}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      min="30"
                      max="300"
                      step="0.1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aktivite Seviyesi
                    </label>
                    <select
                      name="activityLevel"
                      value={profileData.activityLevel}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                      {activityLevelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* BMI Display */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Vücut Kitle İndeksi (BMI)
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-primary-600">
                      {calculateBMI()}
                    </div>
                    <div>
                      <div className={`font-medium ${bmiInfo.color}`}>
                        {bmiInfo.category}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {profileData.height} cm, {profileData.weight} kg
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goals Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Fitness Hedefleriniz
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalOptions.map(goal => (
                      <label
                        key={goal.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                          profileData.goals.includes(goal.id)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                        } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={profileData.goals.includes(goal.id)}
                          onChange={() => handleGoalChange(goal.id)}
                          disabled={!isEditing}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          profileData.goals.includes(goal.id)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {profileData.goals.includes(goal.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {goal.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Güncelleniyor...
                        </div>
                      ) : (
                        'Profili Güncelle'
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 