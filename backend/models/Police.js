const mongoose = require('mongoose');

const policeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    availability: { type: String, enum: ['free', 'busy'], default: 'free' },
    role: { type: String, default: 'police' }
});

module.exports = mongoose.model('Police', policeSchema);
