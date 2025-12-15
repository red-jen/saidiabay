const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { auth, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/active', adController.getActiveAds);
router.post('/:id/click', adController.trackClick);

// Protected routes (admin only)
router.get('/', auth, adminOnly, adController.getAllAds);
router.get('/:id', auth, adminOnly, adController.getAdById);
router.post('/', auth, adminOnly, adController.createAd);
router.put('/:id', auth, adminOnly, adController.updateAd);
router.delete('/:id', auth, adminOnly, adController.deleteAd);
router.patch('/:id/activate', auth, adminOnly, adController.activateAd);
router.patch('/:id/deactivate', auth, adminOnly, adController.deactivateAd);

module.exports = router;
