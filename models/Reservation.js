const mongoose = require('mongoose');
const { buildCheckFunction } = require('express-validator');

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro de catway est requis'],
        ref: 'Catway'
    },
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis'],
        trim: true,
        minlength: [3, 'Le nom doit contenir au moins 3 caractères']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis'],
        minlength: [3, 'Le nom du bateau doit contenir au moins 3 caractères']

    },
    startDate: {
        type: Date,
        required:[true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise'],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'La date de fin doit être après la date de début'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
