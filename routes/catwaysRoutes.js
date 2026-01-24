const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const reservationController = require('../controllers/reservationController');

router.get('/:id/reservations', reservationController.getReservationsByCatway);
router.post('/:id/reservations', reservationController.createReservation);
router.get('/:id/reservations/:idReservation', reservationController.getReservationById);
router.put('/:id/reservations/:idReservation', reservationController.updateReservation);
router.delete('/:id/reservations/:idReservation', reservationController.deleteReservation);

router.get('/', catwayController.getAllCatways);
router.post('/', catwayController.createCatway);
router.get('/:id', catwayController.getCatwayById);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);

module.exports = router;