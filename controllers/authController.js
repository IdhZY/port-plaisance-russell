const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login - Connexion
exports.login = async (req, res) => {
  try {
    // ════════════════════════════════════════
    // 🆕 LOGS DE DEBUG - DÉBUT
    // ════════════════════════════════════════
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 DÉBUT LOGIN');
    console.log('Body reçu:', req.body);
    console.log('Email:', req.body.email);
    console.log('Password:', req.body.password);
    // ════════════════════════════════════════
    
    const { email, password } = req.body;

    // Vérifier que email et password sont fournis
    if (!email || !password) {
      console.log('❌ Email ou password manquant'); // 🆕 LOG
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // ════════════════════════════════════════
    // 🆕 LOG AVANT DE CHERCHER L'UTILISATEUR
    // ════════════════════════════════════════
    console.log('🔍 Recherche utilisateur avec email:', email);
    
    const user = await User.findOne({ email }).select('+password');
    
    // ════════════════════════════════════════
    // 🆕 LOGS APRÈS RECHERCHE
    // ════════════════════════════════════════
    console.log('Utilisateur trouvé ?', !!user);
    if (user) {
      console.log('User ID:', user._id);
      console.log('User email:', user.email);
      console.log('User a un password ?', !!user.password);
    }
    // ════════════════════════════════════════

    if (!user) {
      console.log('❌ Aucun utilisateur avec cet email'); // 🆕 LOG
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // ════════════════════════════════════════
    // 🆕 LOG AVANT VÉRIFICATION MOT DE PASSE
    // ════════════════════════════════════════
    console.log('🔐 Vérification du mot de passe...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Mot de passe valide ?', isPasswordValid);
    // ════════════════════════════════════════

    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect'); // 🆕 LOG
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('✅ Authentification réussie'); // 🆕 LOG

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); // 🆕 LOG
  } catch (error) {
    // ════════════════════════════════════════
    // 🆕 LOGS D'ERREUR DÉTAILLÉS
    // ════════════════════════════════════════
    console.error('❌ ERREUR DANS LOGIN:', error);
    console.error('Stack:', error.stack);
    // ════════════════════════════════════════
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Logout - Déconnexion
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie'
  });
};
