const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Not authorized to access this route' });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user still exists
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token or session expired' });
    }
};

// Middleware for Admin only
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
};
