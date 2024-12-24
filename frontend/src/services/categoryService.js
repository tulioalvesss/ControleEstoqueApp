import api from './api';

export const categoryService = {
  async getAll() {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar categorias');
    }
  },

  async create(categoryData) {
    try {
      const response = await api.post('/api/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar categoria');
    }
  },

  async update(id, categoryData) {
    try {
      const response = await api.put(`/api/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar categoria');
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar categoria');
    }
  },

  getCategoryCount: async (name) => {
    const response = await api.get(`/api/categories/count/${name}`);
    return response.data;
  }
}; 