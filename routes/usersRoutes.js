const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, userController.getAllUsers);
router.get('/:email', verifyToken, userController.getUserByEmail);
router.post('/', verifyToken, userController.createUser);
router.put('/:email', verifyToken, userController.updateUser);
router.delete('/:email', verifyToken, userController.deleteUser);

module.exports = router;