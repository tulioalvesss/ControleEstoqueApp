import api from './api';

export const productService = {
  getAll: async () => {
    const response = await api.get('/api/products');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    try {
      const response = await api.post('/api/products', {
        ...productData,
        sendEmailAlert: productData.sendEmailAlert || false,
        isComposite: true
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  checkLowStock: async (product) => {
    if (product.quantity <= product.minQuantity) {
      try {
        await api.post('/api/notifications/stock-alert', {
          productId: product.id,
          quantity: product.quantity,
          productName: product.name
        });
      } catch (error) {
        console.error('Erro ao criar notificação de estoque baixo:', error);
        throw error;
      }
    }
  }
}; 