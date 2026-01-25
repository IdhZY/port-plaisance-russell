const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const { verifyToken } = require('../middleware/authMiddleware'); // ← CHANGE ICI

// Routes catways (toutes protégées)
router.get('/', verifyToken, catwayController.getAllCatways);
router.get('/:id', verifyToken, catwayController.getCatwayById);
router.post('/', verifyToken, catwayController.createCatway);
router.put('/:id', verifyToken, catwayController.updateCatway);
router.delete('/:id', verifyToken, catwayController.deleteCatway);

module.exports = router;
