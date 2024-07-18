const mongoose = require('mongoose');
require('dotenv').config();


console.log('DATABASE_URL:', process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

connection.on('error', (err) => {
    console.error('Connection to MongoDB unsuccessful:', err);
});
