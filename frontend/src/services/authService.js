import axios from 'axios';

const API_URL = 'http://localhost:3001/api';


export const authService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      
      // Validação da resposta
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Resposta inválida do servidor');
      }

      return response;
    } catch (error) {
      console.error('Erro na requisição de login:', error.response || error);
      
      // Melhor tratamento de erro para o cliente
      if (error.response?.status === 401) {
        throw new Error('Email ou senha inválidos');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Erro ao fazer login. Tente novamente mais tarde.');
      }
    }
  },

  async validateToken(token) {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Erro na validação do token:', error.response || error);
      return false;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/users/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
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