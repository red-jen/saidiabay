import { Router } from 'express';
import { HeroController } from '../controllers/hero.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { heroSchema, updateHeroSchema } from '../../lib/validators/hero';

const router = Router();
const heroController = new HeroController();

// Public routes
router.get('/', heroController.getAll);

// Protected routes
router.get('/:id', authenticate, heroController.getById);
router.post('/', authenticate, validate(heroSchema), heroController.create);
router.put('/:id', authenticate, validate(updateHeroSchema), heroController.update);
router.delete('/:id', authenticate, heroController.delete);
router.post('/reorder', authenticate, heroController.reorder);

export default router;