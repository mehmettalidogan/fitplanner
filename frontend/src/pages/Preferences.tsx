import React from 'react';
import { useNavigate } from 'react-router-dom';
import PreferencesForm from '../components/PreferencesForm';
import Recommendations from '../components/Recommendations';

const Preferences: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tercihler ve Öneriler</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Dashboard'a Dön
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Taraf - Tercihler Formu */}
          <div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tercihlerinizi Güncelleyin</h2>
              <PreferencesForm />
            </div>
          </div>

          {/* Sağ Taraf - Öneriler */}
          <div>
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences; 