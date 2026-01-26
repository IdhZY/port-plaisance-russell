const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:id/reservations', verifyToken, reservationController.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', verifyToken, reservationController.getReservationById);
router.post('/:id/reservations', verifyToken, reservationController.createReservation);
router.put('/:id/reservations/:idReservation', verifyToken, reservationController.updateReservation);
router.delete('/:id/reservations/:idReservation', verifyToken, reservationController.deleteReservation);

module.exports = router;