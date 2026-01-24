const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// 📋 GET /catways/:id/reservations - Récupérer toutes les réservations d'un catway
exports.getReservationsByCatway = async (req, res) => {
  try {
    console.log('🎯 getReservationsByCatway appelé avec id:', req.params.id);
    const catwayNumber = parseInt(req.params.id);
    
    const reservations = await Reservation.find({ catwayNumber });
    console.log(`✅ ${reservations.length} réservation(s) trouvée(s)`);
    
    res.json(reservations);
  } catch (error) {
    console.error('❌ getReservationsByCatway ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// 📋 GET /catways/:id/reservations/:reservationId - Récupérer une réservation spécifique
exports.getReservationById = async (req, res) => {
  try {
    console.log('🎯 getReservationById appelé');
    console.log('   Catway:', req.params.id);
    console.log('   Reservation:', req.params.reservationId);
    
    const reservation = await Reservation.findById(req.params.reservationId);
    
    if (!reservation) {
      console.log('❌ Réservation non trouvée');
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    console.log('✅ Réservation trouvée:', reservation);
    res.json(reservation);
  } catch (error) {
    console.error('❌ getReservationById ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ➕ POST /catways/:id/reservations - Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    console.log('🎯 createReservation appelé avec id:', req.params.id);
    console.log('📦 Body reçu:', req.body);
    
    const catwayNumber = parseInt(req.params.id);
    console.log('🔍 Recherche avec catwayNumber:', catwayNumber, 'type:', typeof catwayNumber);
    
    // Vérifier que le catway existe
    const catway = await Catway.findOne({ catwayNumber: catwayNumber });
    console.log('🔎 Résultat recherche catway:', catway);
    
    if (!catway) {
      console.log('❌ Catway non trouvé');
      return res.status(404).json({ message: `Catway ${catwayNumber} non trouvé` });
    }
    
    console.log('✅ Catway trouvé:', catway);
    
    // Créer la réservation
    const reservationData = {
      catwayNumber: catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };
    
    console.log('📝 Données de réservation:', reservationData);
    
    const reservation = new Reservation(reservationData);
    await reservation.save();
    
    console.log('✅ Réservation créée:', reservation);
    res.status(201).json(reservation);
    
  } catch (error) {
    console.error('❌ createReservation ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ✏️ PUT /catways/:id/reservations/:reservationId - Modifier une réservation
exports.updateReservation = async (req, res) => {
  try {
    console.log('🎯 updateReservation appelé');
    console.log('   Catway:', req.params.id);
    console.log('   Reservation:', req.params.reservationId);
    console.log('📦 Body reçu:', req.body);
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.reservationId,
      {
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      },
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      console.log('❌ Réservation non trouvée');
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    console.log('✅ Réservation modifiée:', reservation);
    res.json(reservation);
  } catch (error) {
    console.error('❌ updateReservation ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// 🗑️ DELETE /catways/:id/reservations/:reservationId - Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    console.log('🎯 deleteReservation appelé');
    console.log('   Catway:', req.params.id);
    console.log('   Reservation:', req.params.reservationId);
    
    const reservation = await Reservation.findByIdAndDelete(req.params.reservationId);
    
    if (!reservation) {
      console.log('❌ Réservation non trouvée');
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    console.log('✅ Réservation supprimée:', reservation);
    res.json({ message: 'Réservation supprimée avec succès', reservation });
  } catch (error) {
    console.error('❌ deleteReservation ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};