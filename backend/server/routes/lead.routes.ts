import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { leadSchema, updateLeadSchema, updateLeadStatusSchema } from '../../lib/validators/lead';

const router = Router();
const leadController = new LeadController();

// Public routes (no authentication required)
router.post('/', optionalAuthenticate, validate(leadSchema), leadController.create);

// User authenticated routes
router.get('/my', authenticate, leadController.getMyLeads);
router.get('/:id', authenticate, leadController.getById);

// Admin authenticated routes
router.get('/', authenticate, requireAdmin, leadController.getAll);
router.get('/property/:propertyId', authenticate, requireAdmin, leadController.getByProperty);
router.patch('/:id/status', authenticate, requireAdmin, validate(updateLeadStatusSchema), leadController.updateStatus);
router.put('/:id', authenticate, requireAdmin, validate(updateLeadSchema), leadController.update);
router.delete('/:id', authenticate, requireAdmin, leadController.delete);

export default router;