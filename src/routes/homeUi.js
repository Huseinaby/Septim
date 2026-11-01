const express = require('express');
const { getAllHomeUi, getHomeUiById, createHomeUi } = require('../controllers/homeUiController');

const router = express.Router();

router.get('/', getAllHomeUi);
router.get('/:id', getHomeUiById);
router.post('/', createHomeUi);

module.exports = router;