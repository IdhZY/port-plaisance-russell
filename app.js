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
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Templates
app.set('view engine', 'ejs');

// Routes

// Routes TEST
app.get('/', (req, res) => {
  res.send('Bienvenue au Port de Plaisance Russell!');
});

// Démarrage serveur

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});