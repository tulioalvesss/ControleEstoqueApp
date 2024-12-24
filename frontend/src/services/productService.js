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
        sendEmailAlert: productData.sendEmailAlert || false
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, productData) => {
    const userId = localStorage.getItem('userId');
    const response = await api.put(`/api/products/${id}`, productData);
    if (userId) {
      await productService.checkLowStock(response.data, userId);
    }
    return response.data;
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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