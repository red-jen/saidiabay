const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, blogController.getAllPosts);
router.get('/recent', blogController.getRecentPosts);
router.get('/:id', optionalAuth, blogController.getPostById);

// Protected routes (admin only)
router.post('/', auth, adminOnly, blogController.createPost);
router.put('/:id', auth, adminOnly, blogController.updatePost);
router.delete('/:id', auth, adminOnly, blogController.deletePost);
router.patch('/:id/publish', auth, adminOnly, blogController.publishPost);
router.patch('/:id/unpublish', auth, adminOnly, blogController.unpublishPost);

module.exports = router;
