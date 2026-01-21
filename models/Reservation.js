const { buildCheckFunction } = require('express-validator');
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true,
        ref: 'Catway'
    },
    clientName: {
        type: String,
        required: true
    },
    boatName: {
        type: String,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
