require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ MongoDB Connected & Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
});
