import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { leadSchema, updateLeadSchema } from '../../lib/validators/lead';

const router = Router();
const leadController = new LeadController();

// Public route (anyone can submit interest)
router.post('/', validate(leadSchema), leadController.create);

// Protected routes (admin only)
router.get('/', authenticate, leadController.getAll);
router.get('/:id', authenticate, leadController.getById);
router.put('/:id', authenticate, validate(updateLeadSchema), leadController.update);
router.delete('/:id', authenticate, leadController.delete);

export default router;