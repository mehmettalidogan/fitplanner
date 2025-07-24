const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server çalışıyor! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/newsletter', newsletterRoutes);

// MongoDB bağlantısı
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.listen(config.port, () => {
  console.log(`Server ${config.port} portunda çalışıyor`);
}); 