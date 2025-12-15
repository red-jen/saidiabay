const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (admin only)
router.post('/', auth, adminOnly, propertyController.createProperty);
router.put('/:id', auth, adminOnly, propertyController.updateProperty);
router.delete('/:id', auth, adminOnly, propertyController.deleteProperty);
router.patch('/:id/sold', auth, adminOnly, propertyController.markAsSold);
router.patch('/:id/status', auth, adminOnly, propertyController.updateStatus);

module.exports = router;
