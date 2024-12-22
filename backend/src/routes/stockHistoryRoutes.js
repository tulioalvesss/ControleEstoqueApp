const express = require('express');
const router = express.Router();
const { getDailyReport, getMonthlyReport } = require('../controllers/stockHistoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/daily', protect, getDailyReport);
router.get('/monthly', protect, getMonthlyReport);

module.exports = router;   