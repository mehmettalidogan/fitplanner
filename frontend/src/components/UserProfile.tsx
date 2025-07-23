import React, { useState } from 'react';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../utils/axios';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    goal?: string;
    activityLevel?: string;
    dailyCalorieTarget?: number;
    profileImage?: string;
  };
  onProfileUpdate: () => void;
}

const goalLabels: { [key: string]: string } = {
  kilo_verme: 'Kilo Verme',
  kilo_alma: 'Kilo Alma',
  kas_kazanma: 'Kas Kazanma',
  form_koruma: 'Form Koruma'
};

const activityLabels: { [key: string]: string } = {
  sedanter: 'Sedanter',
  az_aktif: 'Az Aktif',
  orta_aktif: 'Orta Aktif',
  cok_aktif: 'Çok Aktif',
  ekstra_aktif: 'Ekstra Aktif'
};

const UserProfile: React.FC<UserProfileProps> = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: user.age || '',
    gender: user.gender || '',
    height: user.height || '',
    weight: user.weight || '',
    goal: user.goal || '',
    activityLevel: user.activityLevel || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.patch('/api/auth/profile', formData);
      setIsEditing(false);
      onProfileUpdate();
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg">
            <UserIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold ml-3 text-primary-800">Profil Bilgileri</h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-primary-600 hover:text-primary-800 transition-colors"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yaş</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="0"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Seçiniz</option>
                <option value="erkek">Erkek</option>
                <option value="kadın">Kadın</option>
                <option value="diğer">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Boy (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="0"
                max="300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilo (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="0"
                max="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hedef</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Seçiniz</option>
                {Object.entries(goalLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aktivite Seviyesi</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Seçiniz</option>
                {Object.entries(activityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Kaydet
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">İsim</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">E-posta</p>
            <p className="font-medium">{user.email}</p>
          </div>
          {user.age && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Yaş</p>
              <p className="font-medium">{user.age}</p>
            </div>
          )}
          {user.gender && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Cinsiyet</p>
              <p className="font-medium">{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</p>
            </div>
          )}
          {user.height && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Boy</p>
              <p className="font-medium">{user.height} cm</p>
            </div>
          )}
          {user.weight && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Kilo</p>
              <p className="font-medium">{user.weight} kg</p>
            </div>
          )}
          {user.goal && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Hedef</p>
              <p className="font-medium">{goalLabels[user.goal]}</p>
            </div>
          )}
          {user.activityLevel && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Aktivite Seviyesi</p>
              <p className="font-medium">{activityLabels[user.activityLevel]}</p>
            </div>
          )}
          {user.dailyCalorieTarget && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Günlük Kalori Hedefi</p>
              <p className="font-medium">{user.dailyCalorieTarget} kcal</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile; 