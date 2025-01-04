import api from './api';

export const sectorService = {
  async getSectors() {
    try {
      const response = await api.get('/api/sectors');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar setores');
    }
  },

  async create(sectorData) {
    try {
      const enterpriseId = localStorage.getItem('enterpriseId');
      sectorData.enterpriseId = enterpriseId;
      const response = await api.post('/api/sectors', sectorData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar setor:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar setor');
    }
  },

  async getSectorCount(name) {
    try {
      const response = await api.get(`/api/sectors/count/${name}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao contar setores:', error);
      throw new Error(error.response?.data?.message || 'Erro ao contar setores');
    }
  }
};