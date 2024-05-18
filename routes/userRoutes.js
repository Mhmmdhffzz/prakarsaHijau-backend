const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { getCurrentUser, updateProfile, getUserById } = require('../controllers/userController');

router.get('/me', authenticateToken, getCurrentUser);
router.put('/me/edit', authenticateToken, updateProfile);
router.get('/:userId', authenticateToken, getUserById);

module.exports = router;
