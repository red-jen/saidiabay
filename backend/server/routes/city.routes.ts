import { Router } from 'express';
import { CityController } from '../controllers/city.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { citySchema, updateCitySchema } from '../../lib/validators/city';

const router = Router();
const cityController = new CityController();

// Public route (for dropdowns)
router.get('/', cityController.getAll);

// Protected routes (admin only)
router.get('/:id', authenticate, cityController.getById);
router.post('/', authenticate, requireAdmin, validate(citySchema), cityController.create);
router.put('/:id', authenticate, requireAdmin, validate(updateCitySchema), cityController.update);
router.delete('/:id', authenticate, requireAdmin, cityController.delete);

export default router;