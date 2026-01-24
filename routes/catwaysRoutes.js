const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // ← AJOUTE

router.get('/', isAuthenticated, catwayController.getAllCatways);
router.get('/:id', isAuthenticated, catwayController.getCatwayById);
router.post('/', isAuthenticated, catwayController.createCatway);
router.put('/:id', isAuthenticated, catwayController.updateCatway);
router.delete('/:id', isAuthenticated, catwayController.deleteCatway);

module.exports = router;