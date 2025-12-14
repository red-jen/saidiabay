import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import {
  getBookings,
  getBookingById,
  getPropertyBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController';

const router = Router();

router.get('/', authenticate, isAdmin, getBookings);
router.get('/:id', authenticate, isAdmin, getBookingById);
router.get('/property/:propertyId', getPropertyBookings);
router.post('/', createBooking);
router.put('/:id', authenticate, isAdmin, updateBooking);
router.delete('/:id', authenticate, isAdmin, deleteBooking);

export default router;
