const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // ← AJOUTE

// Protéger toutes les routes users
router.get('/', isAuthenticated, userController.getAllUsers);
router.get('/:email', isAuthenticated, userController.getUserByEmail);
router.post('/', isAuthenticated, userController.createUser);
router.put('/:email', isAuthenticated, userController.updateUser);
router.delete('/:email', isAuthenticated, userController.deleteUser);

module.exports = router;

