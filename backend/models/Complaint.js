const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    proofImage: { type: String }, // Path to Aadhaar/Voter ID
    incidentImage: { type: String }, // Path to incident image
    status: { 
        type: String, 
        enum: ['Pending', 'Assigned', 'Investigating', 'Solved'], 
        default: 'Pending' 
    },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Police', default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
