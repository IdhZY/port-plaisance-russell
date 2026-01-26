require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connexion MongoDB
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// Servir les fichiers CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api-docs', (req, res) => {
  res.send('<h1>📚 Documentation API à venir</h1>');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/reservations', (req, res) => {
    res.render('reservations');
});

app.get('/catways', (req, res) => {
  res.render('catways');
});

app.get('/users', (req, res) => {
  res.render('users');
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const catwayRoutes = require('./routes/catwaysRoutes');
const reservationRoutes = require('./routes/reservationRoutes'); 

// Route pour récupérer les réservations
app.get('/api/catways/reservations/all', async (req, res) => {
    try {
        const Reservation = require('./models/Reservation');
        const reservations = await Reservation.find().sort({ startDate: -1 });
        
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        console.error('Erreur récupération réservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
});

// Montage des routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/catways', reservationRoutes);

// Gestion des erreurs 404 et 500
app.use((req, res) => {
  console.log('❌ 404 - Route non trouvée:', req.originalUrl);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.originalUrl,
    message: 'Cette route n\'existe pas'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Accueil: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs\n`);
});