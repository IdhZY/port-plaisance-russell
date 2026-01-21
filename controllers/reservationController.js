const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// Lister toutes les réservations d'un catway
exports.getReservationsByCatway = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);

    // Vérifier que le catway existe
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${catwayNumber} non trouvé`
      });
    }

    const reservations = await Reservation.find({ catwayNumber })
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

// Récupérer une réservation spécifique
exports.getReservationById = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;

    const reservation = await Reservation.findOne({
      _id: reservationId,
      catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
};

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;

    // Vérifier que le catway existe
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${catwayNumber} non trouvé`
      });
    }

    // Vérifier qu'il n'y a pas de chevauchement de dates
    const overlappingReservation = await Reservation.findOne({
      catwayNumber,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (overlappingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Ce catway est déjà réservé sur cette période',
        conflictingReservation: overlappingReservation
      });
    }

    const reservation = await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate
    });

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};

// Modifier une réservation
exports.updateReservation = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;
    const { clientName, boatName, startDate, endDate } = req.body;

    // Vérifier les chevauchements (en excluant la réservation actuelle)
    if (startDate && endDate) {
      const overlappingReservation = await Reservation.findOne({
        catwayNumber,
        _id: { $ne: reservationId },
        $or: [
          {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
          }
        ]
      });

      if (overlappingReservation) {
        return res.status(400).json({
          success: false,
          message: 'Conflit de dates avec une autre réservation'
        });
      }
    }

    const reservation = await Reservation.findOneAndUpdate(
      { _id: reservationId, catwayNumber },
      { clientName, boatName, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation mise à jour avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: error.message
    });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;

    const reservation = await Reservation.findOneAndDelete({
      _id: reservationId,
      catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la réservation',
      error: error.message
    });
  }
};
