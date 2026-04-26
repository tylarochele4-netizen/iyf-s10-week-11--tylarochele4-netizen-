const express = require('express');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// 1. GLOBAL MIDDLEWARE
// Allows the server to accept JSON data in the body of a request
app.use(express.json());

// 2. MOUNT ROUTES
// Auth routes (Register/Login)
app.use('/api/auth', authRoutes);

// Post routes (CRUD)
app.use('/api/posts', postRoutes);

// 3. 404 HANDLER
// If a user tries to go to a route that doesn't exist
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Route not found' 
    });
});

// 4. GLOBAL ERROR HANDLER
// Catches any errors thrown in controllers (e.g., DB errors)
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ 
            success: false,
            error: messages 
        });
    }

    // Default server error
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

module.exports = app;
