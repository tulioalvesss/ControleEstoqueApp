import api from './api';

export const enterpriseService = {
  async create(enterpriseData) {
    try {
      const response = await api.post('/api/enterprises', enterpriseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const { enterprise, user } = response.data;
      
      // Atualiza os dados do usuário no localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar empresa:', error.response?.data || error);
      throw error;
    }
  },

  async update(id, enterpriseData) {
    try {
      const response = await api.put(`/api/enterprises/${id}`, enterpriseData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/api/enterprises/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      throw error;
    }
  }
};
