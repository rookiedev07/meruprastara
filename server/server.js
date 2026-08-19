const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/meru', require('./src/routes/meruRoutes'));
app.use('/api/compute', require('./src/routes/computeRoutes'));
app.use('/api/benchmark', require('./src/routes/benchmarkRoutes'));
app.use('/api/chandas', require('./src/routes/chandasRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Meru-Prastāra Memoization Demonstration System REST API',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
