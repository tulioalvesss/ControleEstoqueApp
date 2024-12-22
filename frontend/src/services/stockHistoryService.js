import api from './api';

export const reportService = {
  getDailyReport: async (date) => {
    try {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (date > today) {
        return { error: 'Não é possível gerar relatório para datas futuras' };
      }

      const response = await api.get('/api/stock-history/daily', {
        params: { date: date.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório diário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar relatório diário');
    }
  },

  getMonthlyReport: async (month, year) => {
    try {
      const response = await api.get('/api/stock-history/monthly', {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório mensal:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar relatório mensal');
    }
  }
};
