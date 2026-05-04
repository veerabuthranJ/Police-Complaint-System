const express = require('express');
const multer = require('multer');
const Complaint = require('../models/Complaint');
const Police = require('../models/Police');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Submit Complaint
router.post('/submit', auth, upload.fields([
    { name: 'proofImage', maxCount: 1 },
    { name: 'incidentImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, address, area, pincode, phone } = req.body;
        const complaint = new Complaint({
            userId: req.user.id,
            name,
            address,
            area,
            pincode,
            phone,
            proofImage: req.files['proofImage'] ? req.files['proofImage'][0].path : null,
            incidentImage: req.files['incidentImage'] ? req.files['incidentImage'][0].path : null
        });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Complaints
router.get('/user', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id }).populate('assignedOfficer', 'name');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Complaints (Police Only)
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'police') return res.status(403).json({ message: 'Access denied' });
    try {
        const complaints = await Complaint.find().populate('assignedOfficer', 'name');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign Case
router.put('/assign/:id', auth, async (req, res) => {
    if (req.user.role !== 'police') return res.status(403).json({ message: 'Access denied' });
    try {
        const { officerId } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedOfficer: officerId, status: 'Assigned' },
            { new: true }
        ).populate('assignedOfficer', 'name');
        
        // Mark officer as busy
        await Police.findByIdAndUpdate(officerId, { availability: 'busy' });
        
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Status
router.put('/status/:id', auth, async (req, res) => {
    if (req.user.role !== 'police') return res.status(403).json({ message: 'Access denied' });
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (status === 'Solved' && complaint.assignedOfficer) {
            await Police.findByIdAndUpdate(complaint.assignedOfficer, { availability: 'free' });
        }
        
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
