const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    console.log('🔍 Header Authorization:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Non authentifié. Token manquant.' 
      });
    }
    
    // Extraire le token (enlever "Bearer ")
    const token = authHeader.split(' ')[1];
    
    console.log('🎫 Token reçu:', token);
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token valide, user:', decoded);
    
    // Ajouter les infos user à la requête
    req.user = decoded;
    
    next();
    
  } catch (error) {
    console.log('❌ Erreur token:', error.message);
    
    return res.status(401).json({ 
      success: false,
      message: 'Token invalide ou expiré.' 
    });
  }
};

module.exports = { isAuthenticated };
