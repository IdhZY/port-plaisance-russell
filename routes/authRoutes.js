const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes d'authentification
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
