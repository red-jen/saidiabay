const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const propertyRoutes = require('./properties');
const reservationRoutes = require('./reservations');
const blogRoutes = require('./blog');
const adRoutes = require('./ads');

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/reservations', reservationRoutes);
router.use('/blog', blogRoutes);
router.use('/ads', adRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SaidiaBay API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
