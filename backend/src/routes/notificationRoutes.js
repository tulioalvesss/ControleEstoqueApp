const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
  createStockAlert
} = require('../controllers/notificationController');

router.use(protect);

router.get('/', getNotifications);

router.put('/:id/read', markAsRead);

router.post('/', createNotification);

router.post('/stock-alert', createStockAlert);

router.delete('/:id', deleteNotification);

module.exports = router;