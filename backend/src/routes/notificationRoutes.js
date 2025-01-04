const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Protege todas as rotas de notificações
router.use(protect);

router.get('/unread', notificationController.getUnreadNotifications);
router.get('/:enterpriseId', notificationController.getAllNotificationsByEnterprise);
router.post('/:id/read', notificationController.markAsRead);

module.exports = router;
