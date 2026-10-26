
const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { getUserById } = require('../controllers/usersController');

const router = express.Router();

router.use(authenticateToken);

router.get('/me', getUserById);

module.exports = router;
