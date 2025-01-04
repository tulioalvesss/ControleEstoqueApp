const Notification = require('../models/Notification');

const notificationService = {
  async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      return notification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  },

  async getUnreadNotifications(enterpriseId) {
    try {
      return await Notification.findAll({
        where: { 
          read: false,
          enterpriseId 
        },
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      throw error;
    }
  },

  async markAsRead(id) {
    try {
      await Notification.update(
        { read: true },
        { where: { id } }
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  },
  async getAllNotificationsByEnterprise(enterpriseId) {
    try {
      return await Notification.findAll({ where: { enterpriseId } });
    } catch (error) {
      console.error('Erro ao buscar todas as notificações por empresa:', error);
      throw error;
    }
  }
};

module.exports = notificationService;
