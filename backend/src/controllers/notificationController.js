const { Notification } = require('../models/associations');

const notificationController = {
  // Método auxiliar para criar notificações internamente
  createNotificationInternal: async ({ message, type, productId, enterpriseId, app }) => {
    try {
      console.log('Iniciando criação de notificação interna...');
      const notification = await Notification.create({
        message,
        type,
        productId,
        enterpriseId
      });

      // Emite evento de nova notificação via WebSocket
      if (app && app.get('io')) {
        const io = app.get('io');
        console.log(`Emitindo notificação para enterprise_${enterpriseId}`);
        io.to(`enterprise_${enterpriseId}`).emit('newNotification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  },

  // Buscar todas as notificações da empresa
  getNotifications: async (req, res) => {
    try {
      const enterpriseId = req.user.enterpriseId;
      const notifications = await Notification.findAll({
        where: { enterpriseId },
        order: [['createdAt', 'DESC']]
      });
      res.json(notifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Marcar notificação como lida
  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      if (notification.enterpriseId !== req.user.enterpriseId) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }

      notification.read = true;
      await notification.save();
      res.json(notification);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Criar nova notificação
  createNotification: async (req, res) => {
    try {
      const { message, type, productId, enterpriseId } = req.body;
      const notification = await Notification.create({
        message,
        type,
        productId,
        enterpriseId
      });

      // Emite evento de nova notificação via WebSocket
      const io = req.app.get('io');
      if (io) {
        io.to(`enterprise_${enterpriseId}`).emit('newNotification', notification);
      }

      res.status(201).json(notification);
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Deletar notificação
  deleteNotification: async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      if (notification.enterpriseId !== req.user.enterpriseId) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }

      await notification.destroy();
      res.json({ message: 'Notificação deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      res.status(500).json({ error: error.message });
    }
  },

  createStockAlert: async (req, res) => {
    try {
      const { productId, quantity, productName } = req.body;
      const enterpriseId = req.user.enterpriseId;

      const notification = await Notification.create({
        message: `Produto ${productName} está com estoque baixo (${quantity} unidades)`,
        type: 'low_stock',
        productId,
        enterpriseId
      });

      // Emite evento de nova notificação via WebSocket
      const io = req.app.get('io');
      if (io) {
        io.to(`enterprise_${enterpriseId}`).emit('newNotification', notification);
      }

      res.status(201).json(notification);
    } catch (error) {
      console.error('Erro ao criar alerta de estoque:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = notificationController;