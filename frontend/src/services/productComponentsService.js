import api from './api';


export const productComponentsService = {
  
  async createProductComponent(productComponent) {
    try {
            console.log(productComponent);
            const response = await api.post('/api/product-components', productComponent);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao criar componente do produto');
        }
    },

    async getProductComponents(productId) {
        try {
            const response = await api.get(`/api/product-components/${productId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao buscar componentes do produto');
        }
    },

    async updateProductComponent(id, productComponent) {
        try {
            const response = await api.put(`/api/product-components/${id}`, productComponent);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao atualizar componente do produto');
        }
    },

    async deleteProductComponent(id) {
        try {
            await api.delete(`/api/product-components/${id}`);
            console.log( id,'Componente excluído com sucesso');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao excluir componente do produto');
        }
    },

    async getAvailableComponents() {
        try {
            const response = await api.get('/api/stock-components/available');
            return response.data;
        } catch (error) {
            console.error('Erro na requisição de componentes:', error);
            throw new Error('Erro ao buscar componentes disponíveis');
        }
    },

    async getAllComponents() {
        try {
            const response = await api.get('/api/product-components');
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar componentes disponíveis');
        }
    }
}