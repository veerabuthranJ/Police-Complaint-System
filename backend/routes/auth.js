const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Police = require('../models/Police');
const router = express.Router();

// User Register
router.post('/register/user', async (req, res) => {
    try {
        const { name, address, phone, password } = req.body;
        let user = await User.findOne({ phone });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, address, phone, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: 'user' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Police Register
router.post('/register/police', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let police = await Police.findOne({ email });
        if (police) return res.status(400).json({ message: 'Police officer already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        police = new Police({ name, email, password: hashedPassword });
        await police.save();

        const token = jwt.sign({ id: police._id, role: 'police' }, process.env.JWT_SECRET);
        res.json({ token, user: { id: police._id, name: police.name, email: police.email, role: 'police' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User/Police Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password, role } = req.body; // identifier can be email or phone
        let account;
        
        if (role === 'police') {
            account = await Police.findOne({ email: identifier });
        } else {
            account = await User.findOne({ phone: identifier });
        }

        if (!account) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: account._id, role }, process.env.JWT_SECRET);
        res.json({ 
            token, 
            user: { 
                id: account._id, 
                name: account.name, 
                role, 
                phone: role === 'user' ? account.phone : undefined,
                email: role === 'police' ? account.email : undefined
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
