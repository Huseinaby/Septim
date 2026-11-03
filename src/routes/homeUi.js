const express = require('express');
const {
  getAllHomeUi,
  getHomeUiById,
  createHomeUi,
  updateHomeUi,
  deleteHomeUi
} = require('../controllers/homeUiController');

const router = express.Router();

router.get('/', getAllHomeUi);
router.get('/:id', getHomeUiById);
router.post('/', createHomeUi);
router.put('/:id', updateHomeUi);
router.delete('/:id', deleteHomeUi);

module.exports = router;