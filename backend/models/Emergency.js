const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Police', default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emergency', emergencySchema);
