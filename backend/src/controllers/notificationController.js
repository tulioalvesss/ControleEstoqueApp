const notificationService = require('../services/notificationService');

exports.getUnreadNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user.enterpriseId) {
      return res.status(401).json({ 
        message: 'Usuário não autenticado ou empresa não identificada' 
      });
    }

    const notifications = await notificationService.getUnreadNotifications(req.user.enterpriseId);
    res.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações não lidas:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID da notificação não fornecido' });
    }

    await notificationService.markAsRead(id);
    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllNotificationsByEnterprise = async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    const notifications = await notificationService.getAllNotificationsByEnterprise(enterpriseId);
    res.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar todas as notificações por empresa:', error);
    res.status(500).json({ message: error.message });
  }
};