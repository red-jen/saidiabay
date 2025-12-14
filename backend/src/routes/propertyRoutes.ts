import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController';

const router = Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticate, isAdmin, createProperty);
router.put('/:id', authenticate, isAdmin, updateProperty);
router.delete('/:id', authenticate, isAdmin, deleteProperty);

export default router;
