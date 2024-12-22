import api from './api';

export const enterpriseUsersService = {
  getUsers: async () => {
    const response = await api.get('/api/enterprises');
    return response.data.users;
  },

  createUser: async (userData) => {
    const response = await api.post('/api/enterprises/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/api/enterprises/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/api/enterprises/users/${id}`);
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/enterprises/users/${id}`);
    return response.data;
  }
};

export default enterpriseUsersService;
