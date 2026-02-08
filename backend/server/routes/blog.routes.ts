import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { blogSchema, updateBlogSchema } from '../../lib/validators/blog';

const router = Router();
const blogController = new BlogController();

// Public routes
router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);

// Protected routes
router.post('/', authenticate, validate(blogSchema), blogController.create);
router.put('/:id', authenticate, validate(updateBlogSchema), blogController.update);
router.delete('/:id', authenticate, blogController.delete);

export default router;