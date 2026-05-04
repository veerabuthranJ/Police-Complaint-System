const express = require('express');
const Police = require('../models/Police');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all officers
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'police') return res.status(403).json({ message: 'Access denied' });
    try {
        const officers = await Police.find({}, '-password');
        res.json(officers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
