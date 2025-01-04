import api from './api';

export const stockComponentService = {
  async getStockComponentsProduct(productId) {
    const response = await api.get(`/api/stock-components/product/${productId}`);
    return response.data;
  },
  async getComponentById(componentId) {
    const response = await api.get(`/api/stock-components/product/${componentId}`);
    return response.data;
  },
  async getStockComponentsStock(stockId) {
    const response = await api.get(`/api/stock-components/stock/${stockId}`);
    return response.data;
  },
  async createComponent(data) {
    const response = await api.post('/api/stock-components', data);
    return response.data;
  },
  async updateComponent(id, data) {
    const response = await api.put(`/api/stock-components/${id}`, data);
    return response.data;
  }
};
