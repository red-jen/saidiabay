import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { reservationSchema, updateReservationSchema } from '../../lib/validators/reservation';

const router = Router();
const reservationController = new ReservationController();

// Public route (anyone can create a reservation)
router.post('/', validate(reservationSchema), reservationController.create);

// Protected routes
router.get('/', authenticate, reservationController.getAll);
router.get('/my', authenticate, reservationController.getMyReservations);
router.get('/:id', authenticate, reservationController.getById);
router.put('/:id', authenticate, validate(updateReservationSchema), reservationController.update);
router.post('/:id/cancel', authenticate, reservationController.cancel);

export default router;