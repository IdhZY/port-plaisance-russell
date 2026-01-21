const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true,
        unique: true,
        min: [1, 'Le numéro doit être positif']
    },
    catwayType: {
        type: String,
        enum: ['short','long'],
        required: true,
        message: '"short" or "long" only'
    },
    catwayState: {
        type: String,
        required: [true, 'L\'état du catway est requis'],
        trim: true,
        default: 'bon état'
    }
}, { timestamps: true });

module.exports = mongoose.model('Catway', catwaySchema);