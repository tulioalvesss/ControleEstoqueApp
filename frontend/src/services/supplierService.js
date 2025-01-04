import api from './api';

export const supplierService = {
  getAll: async () => {
    const enterpriseId = localStorage.getItem('enterpriseId');
    const response = await api.get(`/api/suppliers/${enterpriseId}`);
    return response.data.map(supplier => ({
      ...supplier,
      id: supplier.id
    }));
  },
  create: async (supplier) => {
    const enterpriseId = localStorage.getItem('enterpriseId');
    const response = await api.post('/api/suppliers', { 
      ...supplier, 
      enterpriseId 
    });
    return {
      ...response.data,
      id: response.data.id
    };
  },
  update: async (id, supplier) => {
    const enterpriseId = localStorage.getItem('enterpriseId');
    const response = await api.put(`/api/suppliers/${id}`, {
      ...supplier,
      enterpriseId,
      id
    });
    return {
      ...response.data,
      id: response.data.id
    };
  },
  delete: async (id) => {
    await api.delete(`/api/suppliers/${id}`);
  }
};

export default supplierService;