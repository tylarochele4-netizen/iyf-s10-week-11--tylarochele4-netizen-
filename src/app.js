const express = require('express');
const postRoutes = require('./routes/posts');

const app = express();

app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// Simple Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
