import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController';

const router = Router();

router.get('/', authenticate, isAdmin, getContacts);
router.get('/:id', authenticate, isAdmin, getContactById);
router.post('/', createContact);
router.put('/:id', authenticate, isAdmin, updateContact);
router.delete('/:id', authenticate, isAdmin, deleteContact);

export default router;
