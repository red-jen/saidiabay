const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/check-availability', reservationController.checkAvailability);

// Create reservation (can be done by guest or authenticated user)
router.post('/', optionalAuth, reservationController.createReservation);

// Authenticated user routes
router.get('/my-reservations', auth, reservationController.getMyReservations);

// Protected routes (admin only)
router.get('/', auth, adminOnly, reservationController.getAllReservations);
router.get('/:id', auth, reservationController.getReservationById);
router.put('/:id', auth, adminOnly, reservationController.updateReservation);
router.delete('/:id', auth, adminOnly, reservationController.deleteReservation);
router.patch('/:id/confirm', auth, adminOnly, reservationController.confirmReservation);
router.patch('/:id/cancel', auth, reservationController.cancelReservation);

module.exports = router;
