const express = require('express');
const { getAllHomeUi } = require('../controllers/homeUiController');

const router = express.Router();

router.get('/', getAllHomeUi);

module.exports = router;