const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConfig = require('./config/dbConfig');

// dotenv.config();
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoute'));
app.use('/api/shows', require('./routes/showRoute'));
app.use('/api/bookings', require('./routes/bookingRoute'));

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
