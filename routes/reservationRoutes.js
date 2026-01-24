const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationCtrl = require('../controllers/reservationController');

router.get('/', reservationCtrl.getReservationsByCatway);
router.get('/:idReservation', reservationCtrl.getReservationById);
router.post('/', reservationCtrl.createReservation);
router.put('/:idReservation', reservationCtrl.updateReservation);
router.delete('/:idReservation', reservationCtrl.deleteReservation);

module.exports = router;