const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Routes pour les réservations (sous-ressource des catways)

router.get('/:id/reservations', reservationController.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', reservationController.getReservationById);
router.post('/:id/reservations', reservationController.createReservation);
router.put('/:id/reservations/:idReservation', reservationController.updateReservation);
router.delete('/:id/reservations/:idReservation', reservationController.deleteReservation);

module.exports = router;
