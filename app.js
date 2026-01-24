require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connexion MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 Middleware de logging (pour debug)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ IMPORT DES ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const catwayRoutes = require('./routes/catwaysRoutes');

// ✅ MONTAGE DES ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes); // ← Les réservations sont DANS catwayRoutes !

// Routes de santé
app.get('/', (req, res) => {
  res.json({ message: 'API Port de Plaisance - OK ✅' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  console.log('❌ 404 - Route non trouvée:', req.originalUrl);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.originalUrl,
    message: 'Cette route n\'existe pas'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});