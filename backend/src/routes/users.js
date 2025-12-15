const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

// All routes require admin privileges
router.use(auth, adminOnly);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
