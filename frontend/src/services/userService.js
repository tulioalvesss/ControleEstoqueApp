import api from './api';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/api/users/${id}`);
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  getProfile: async () => {
    try {
      const response = await api.get(`/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  }
};

export default userService; 