import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  reservationSchema,
  updateReservationSchema,
  updateReservationStatusSchema,
  checkAvailabilitySchema,
} from '../../lib/validators/reservation';

const router = Router();
const reservationController = new ReservationController();

// Public routes (no authentication required)
router.post('/check-availability', validate(checkAvailabilitySchema), reservationController.checkAvailability);
router.post('/', optionalAuthenticate, validate(reservationSchema), reservationController.create);
router.get('/property/:propertyId', reservationController.getByProperty);

// User authenticated routes
router.get('/my', authenticate, reservationController.getMyReservations);
router.get('/:id', authenticate, reservationController.getById);
router.post('/:id/cancel', authenticate, reservationController.cancel);

// Admin authenticated routes
router.get('/', authenticate, requireAdmin, reservationController.getAll);
router.patch('/:id/status', authenticate, requireAdmin, validate(updateReservationStatusSchema), reservationController.updateStatus);
router.put('/:id', authenticate, requireAdmin, validate(updateReservationSchema), reservationController.update);
router.delete('/:id', authenticate, requireAdmin, reservationController.delete);

export default router;