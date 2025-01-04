import api from './api';

export const stockService = {
  async addStockComponent(data) {
    return await api.post('/api/stock-components', data);
  },
  async updateStockComponent(id, data) {
    return await api.put(`/api/stock-components/${id}`, data);
  },
  async getStockComponents(stockId) {
    return await api.get(`/api/stock-components/stock/${stockId}`);
  },
  async deleteStockComponent(id) {
    return await api.delete(`/api/stock-components/${id}`);
  },
  async getStockComponentsAll() {
    const response = await api.get(`/api/stocks/`);
    return response.data;

  }
};


