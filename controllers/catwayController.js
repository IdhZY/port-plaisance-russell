const Catway = require('../models/Catway');

// Lister tous les catways
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

// Catways/:id OU /:catwayNumber
exports.getCatwayById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Recherche:', id);

    let catway;
    try {
      catway = await Catway.findById(id);
    } catch (e) {

      catway = await Catway.findOne({ catwayNumber: id });
    }

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${id} non trouvé`
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

// Créer un nouveau catway
exports.createCatway = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    const existingCatway = await Catway.findOne({ catwayNumber });
    if (existingCatway) {
      return res.status(400).json({
        success: false,
        message: `Le catway ${catwayNumber} existe déjà`
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
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
};

// PUT
exports.updateCatway = async (req, res) => {
  try {
    const { catwayState } = req.body;
    const { id } = req.params;

    if (!catwayState) {
      return res.status(400).json({
        success: false,
        message: 'catwayState requis'
      });
    }

    const catway = await Catway.findOneAndUpdate(
      { $or: [{ _id: id }, { catwayNumber: id }] },
      { catwayState },
      { new: true, runValidators: true }
    );

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${id} non trouvé`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Catway mis à jour',
      data: catway
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur mise à jour',
      error: error.message
    });
  }
};

// DELETE
exports.deleteCatway = async (req, res) => {
  try {
    const { id } = req.params;

    const catway = await Catway.findOneAndDelete(
      { $or: [{ _id: id }, { catwayNumber: id }] }
    );

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: `Catway ${id} non trouvé`
      });
    }

    // Supprime réservations associées
    const Reservation = require('../models/Reservation');
    await Reservation.deleteMany({ catwayNumber: catway.catwayNumber });

    res.status(200).json({
      success: true,
      message: `Catway ${catway.catwayNumber} supprimé`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur suppression',
      error: error.message
    });
  }
};