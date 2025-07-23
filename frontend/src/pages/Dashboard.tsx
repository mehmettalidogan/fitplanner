import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ScaleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const weeklyProgress = [
    { day: 'Pzt', protein: 120, carbs: 200, fat: 60 },
    { day: 'Sal', protein: 100, carbs: 180, fat: 55 },
    { day: 'Çar', protein: 140, carbs: 210, fat: 65 },
    { day: 'Per', protein: 110, carbs: 190, fat: 50 },
    { day: 'Cum', protein: 130, carbs: 220, fat: 70 },
    { day: 'Cmt', protein: 90, carbs: 160, fat: 45 },
    { day: 'Paz', protein: 115, carbs: 185, fat: 58 },
  ];

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Günün Antrenmanı */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3 text-primary-800">Günün Antrenmanı</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Squat', sets: '4 x 12' },
                { name: 'Bench Press', sets: '3 x 10' },
                { name: 'Deadlift', sets: '5 x 5' }
              ].map((exercise, index) => (
                <motion.div 
                  key={exercise.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                >
                  <span className="font-medium text-secondary-700">{exercise.name}</span>
                  <span className="text-primary-600 font-semibold">{exercise.sets}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Makro Takibi */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="p-2 bg-action-yellow-100 rounded-lg">
                <ScaleIcon className="h-6 w-6 text-action-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3 text-primary-800">Günlük Makrolar</h2>
            </div>
            <div className="space-y-6">
              <MacroProgress title="Protein" current={80} target={150} color="bg-primary-500" textColor="text-primary-700" />
              <MacroProgress title="Karbonhidrat" current={150} target={250} color="bg-action-yellow-500" textColor="text-action-yellow-700" />
              <MacroProgress title="Yağ" current={45} target={70} color="bg-action-orange-500" textColor="text-action-orange-700" />
            </div>
          </motion.div>

          {/* Motivasyon */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="p-2 bg-action-orange-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-action-orange-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3 text-primary-800">Günün Sözü</h2>
            </div>
            <p className="text-lg text-secondary-600 italic text-center mt-4">
              "Başarı bir yolculuktur, varış noktası değil."
            </p>
          </motion.div>

          {/* Haftalık Makro Grafiği */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-3"
          >
            <h2 className="text-xl font-semibold mb-6 text-primary-800">Haftalık Makro Takibi</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="protein" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', strokeWidth: 2 }}
                    name="Protein"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbs" 
                    stroke="#eab308" 
                    strokeWidth={2}
                    dot={{ fill: '#eab308', strokeWidth: 2 }}
                    name="Karbonhidrat"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fat" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ fill: '#f97316', strokeWidth: 2 }}
                    name="Yağ"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

interface MacroProgressProps {
  title: string;
  current: number;
  target: number;
  color: string;
  textColor: string;
}

const MacroProgress: React.FC<MacroProgressProps> = ({ title, current, target, color, textColor }) => {
  const percentage = (current / target) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium text-secondary-700">{title}</span>
        <span className={`font-semibold ${textColor}`}>{current}/{target}g</span>
      </div>
      <div className="w-full bg-secondary-100 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${color} rounded-full h-2.5`}
        />
      </div>
    </div>
  );
};

export default Dashboard; 