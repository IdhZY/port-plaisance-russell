const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/catways/:id/reservations', reservationController.getReservationsByCatway);
router.get('/catways/:id/reservations/:idReservation', reservationController.getReservationById);
router.post('/catways/:id/reservations', reservationController.createReservation);
router.put('/catways/:id/reservations/:idReservation', reservationController.updateReservation);
router.delete('/catways/:id/reservations/:idReservation', reservationController.deleteReservation);

module.exports = router;

