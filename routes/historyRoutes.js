const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');


const { protect } = require('../middlewares/authMiddleware');

// 👇 2. Selipkan middleware "protect" di tengah-tengah
// GET /api/history
router.get('/', protect, getHistory);

module.exports = router;