const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservationController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // ← AJOUTE

// Protéger toutes les routes
router.get('/', isAuthenticated, reservationController.getAllReservations);
router.get('/:idReservation', isAuthenticated, reservationController.getReservationById);
router.post('/', isAuthenticated, reservationController.createReservation);
router.put('/:idReservation', isAuthenticated, reservationController.updateReservation);
router.delete('/:idReservation', isAuthenticated, reservationController.deleteReservation);

module.exports = router;
