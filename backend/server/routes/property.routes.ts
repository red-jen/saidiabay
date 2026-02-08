import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { propertySchema, updatePropertySchema } from '../../lib/validators/property';

const router = Router();
const propertyController = new PropertyController();

// Public routes (for website visitors)
router.get('/', propertyController.getAll);
router.get('/:id', propertyController.getById);
router.get('/:id/availability', propertyController.checkAvailability);

// Protected routes (admin only)
router.post('/', authenticate, validate(propertySchema), propertyController.create);
router.put('/:id', authenticate, validate(updatePropertySchema), propertyController.update);
router.delete('/:id', authenticate, propertyController.delete);

export default router;