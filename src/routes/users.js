const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

const router = express.Router();
const validateUserId = require('../middlewares/validateUserId');

router.use(authenticateToken); // Apply authentication middleware to all routes in this router

// Register a new user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

// Get a user by ID
router.get('/:id', validateUserId, getUserById);

// Update a user by ID
router.put('/:id', validateUserId, updateUser);

// Delete a user by ID
router.delete('/:id', validateUserId, deleteUser);

module.exports = router;