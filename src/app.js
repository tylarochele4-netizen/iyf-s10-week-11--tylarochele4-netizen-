const express = require('express');
const postRoutes = require('./routes/posts');

const app = express();

// Body parser
app.use(express.json());

// Mount Routes
app.use('/api/posts', postRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Server Error'
    });
});

module.exports = app;
