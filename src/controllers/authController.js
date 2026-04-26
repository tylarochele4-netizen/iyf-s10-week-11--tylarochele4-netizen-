const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to create the token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email or Username already exists' });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // 2. Find user and include password (since we set select: false in model)
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Send token
        const token = generateToken(user._id);
        res.json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};
