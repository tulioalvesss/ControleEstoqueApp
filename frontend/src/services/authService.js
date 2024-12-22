import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('enterpriseId', response.data.enterpriseId.toString());
      localStorage.setItem('userId', response.data.id.toString());
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('enterpriseId');
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Erro ao parsear dados do usuário:', e);
      return null;
    }
  }
  return null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return getToken() !== null;
};

export const logout = () => {
  removeUser();
  removeToken();
}; 