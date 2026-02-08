import { Router } from 'express';
import { BlockedDateController } from '../controllers/blockedDate.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { blockedDateSchema, updateBlockedDateSchema } from '../../lib/validators/blockedDate';

const router = Router();
const blockedDateController = new BlockedDateController();

// Public routes (no authentication required)
router.get('/property/:propertyId', blockedDateController.getByProperty);

// Admin authenticated routes
router.post('/', authenticate, requireAdmin, validate(blockedDateSchema), blockedDateController.create);
router.get('/', authenticate, requireAdmin, blockedDateController.getAll);
router.get('/:id', authenticate, requireAdmin, blockedDateController.getById);
router.put('/:id', authenticate, requireAdmin, validate(updateBlockedDateSchema), blockedDateController.update);
router.delete('/:id', authenticate, requireAdmin, blockedDateController.delete);

export default router;
