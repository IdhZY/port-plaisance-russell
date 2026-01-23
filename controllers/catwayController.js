const Catway = require('../models/Catway');

// GET /catways - Lister tous les catways
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.status(200).json({
      success: true,
      count: catways.length,
      data: catways
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catways',
      error: error.message
    });
  }
};

// GET /catways/:id - Récupérer un catway par son numéro
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${req.params.id} non trouvé`
      });
    }

    res.status(200).json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du catway',
      error: error.message
    });
  }
};

// POST /catways - Créer un nouveau catway
exports.createCatway = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Vérifier si le catway existe déjà
    const existingCatway = await Catway.findOne({ catwayNumber });
    if (existingCatway) {
      return res.status(400).json({
        success: false,
        message: `Le catway numéro ${catwayNumber} existe déjà`
      });
    }

    const catway = await Catway.create({
      catwayNumber,
      catwayType,
      catwayState: catwayState || 'bon état'
    });

    res.status(201).json({
      success: true,
      message: 'Catway créé avec succès',
      data: catway
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du catway',
      error: error.message
    });
  }
};

// PUT /catways/:id - Modifier l'état d'un catway (uniquement catwayState)
exports.updateCatway = async (req, res) => {
  try {
    const { catwayState } = req.body;

    // Vérifier que seul catwayState est modifié
    if (!catwayState) {
      return res.status(400).json({
        success: false,
        message: 'Le champ catwayState est requis'
      });
    }

    // Interdire la modification de catwayNumber et catwayType
    if (req.body.catwayNumber || req.body.catwayType) {
      return res.status(403).json({
        success: false,
        message: 'Le numéro et le type du catway ne peuvent pas être modifiés'
      });
    }

    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState },
      { new: true, runValidators: true }
    );

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${req.params.id} non trouvé`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Catway mis à jour avec succès',
      data: catway
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du catway',
      error: error.message
    });
  }
};

//Supprimer un catway
exports.deleteCatway = async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${req.params.id} non trouvé`
      });
    }

    // Supprimer aussi toutes les réservations associées
    const Reservation = require('../models/Reservation');
    await Reservation.deleteMany({ catwayNumber: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Catway et ses réservations supprimés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du catway',
      error: error.message
    });
  }
};