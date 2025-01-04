import api from './api';

export const notificationService = {
  async getUnreadNotifications() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await api.get('/api/notifications/unread', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Usuário não autenticado');
      }
      throw new Error('Erro ao buscar notificações não lidas');
    }
  },

  async markAsRead(id) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await api.post(`/api/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw new Error('Erro ao marcar notificação como lida');
    }
  },

  async getAllNotificationsByEnterprise() {
    try {
      const token = localStorage.getItem('token');
      const enterpriseId = localStorage.getItem('enterpriseId');  
      if (!token || !enterpriseId) {
        throw new Error('Usuário não autenticado');
      }
      const response = await api.get(`/api/notifications/${enterpriseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const allNotificationsRead = response.data.filter(n => n.read === true);
      return allNotificationsRead;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Usuário não autenticado');
      }
      throw new Error('Erro ao buscar todas as notificações por empresa');
    }
  }
};