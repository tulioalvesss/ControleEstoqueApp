import api from './api';

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  create: async (categoryData) => {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  },

  getCategoryCount: async (name) => {
    const response = await api.get(`/api/categories/count/${name}`);
    return response.data;
  }
}; 