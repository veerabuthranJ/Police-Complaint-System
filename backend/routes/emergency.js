const express = require('express');
const Emergency = require('../models/Emergency');
const Police = require('../models/Police');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Emergency Alert
router.post('/alert', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        
        // Find available police officer (prefer free ones, otherwise pick any)
        let availableOfficer = await Police.findOne({ availability: 'free' });
        if (!availableOfficer) {
            availableOfficer = await Police.findOne({});
        }
        
        const emergency = new Emergency({
            userId: req.user.id,
            location: { latitude, longitude },
            assignedOfficer: availableOfficer ? availableOfficer._id : null
        });
        
        if (availableOfficer) {
            availableOfficer.availability = 'busy';
            await availableOfficer.save();
        }
        
        await emergency.save();
        
        const populatedEmergency = await Emergency.findById(emergency._id)
            .populate('userId', 'name phone')
            .populate('assignedOfficer', 'name');

        // Emit socket event to all police officers
        const io = req.app.get('io');
        io.emit('newEmergency', populatedEmergency);

        res.status(201).json(populatedEmergency);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Emergency Alerts (Police Only)
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'police') return res.status(403).json({ message: 'Access denied' });
    try {
        const alerts = await Emergency.find().populate('userId', 'name phone').populate('assignedOfficer', 'name');
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign Officer to Emergency (Police Only)
router.put('/assign/:id', auth, async (req, res) => {
    if (req.user.role !== 'police') return res.status(403).json({ message: 'Access denied' });
    try {
        const { officerId } = req.body;
        const alert = await Emergency.findByIdAndUpdate(
            req.params.id,
            { assignedOfficer: officerId },
            { new: true }
        ).populate('assignedOfficer', 'name');
        
        // Mark officer as busy
        await Police.findByIdAndUpdate(officerId, { availability: 'busy' });
        
        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
