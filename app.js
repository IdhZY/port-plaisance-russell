require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const User = require('./models/User');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');

const app = express();

// Connexion MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Routes accueil API
app.get('/', (req, res) => {
  console.log('Accueil API');
  res.json({
    message: '🚢 Bienvenue sur l\'API Port de Plaisance Russell',
    version: '1.0.0',
    endpoints: {
      auth: '/login, /logout',
      users: '/users',
      catways: '/catways',
      reservations: '/catways/:id/reservations'
    }
  });
});

// Routes
const authRoutes = require ('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const catwayRoutes = require('./routes/catwaysRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);

// Templates
app.set('view engine', 'ejs');

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});