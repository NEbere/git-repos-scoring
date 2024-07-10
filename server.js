require('dotenv').config();
const repoRoutes = require('./routes/repoRoutes');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Enhanced logging
if (isProduction) {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Basic security enhancements
if (isProduction) {
    app.use(helmet());
}

app.use('/repos', repoRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});