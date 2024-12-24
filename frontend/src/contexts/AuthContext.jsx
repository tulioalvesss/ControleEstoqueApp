import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasEnterprise, setHasEnterprise] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isValid = await authService.validateToken(token);
          setIsAuthenticated(isValid);
          if (isValid) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            setHasEnterprise(!!userData?.enterpriseId);
          }
        } catch (error) {
          console.error('Erro na validação do token:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (!response?.data) {
        throw new Error('Resposta inválida do servidor');
      }

      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error('Dados de autenticação incompletos');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('enterpriseId', userData.enterpriseId);
      
      setIsAuthenticated(true);
      setUser(userData);
      setHasEnterprise(!!userData.enterpriseId);
      
      return {
        user: userData,
        hasEnterprise: !!userData.enterpriseId
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setHasEnterprise(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    setHasEnterprise(!!userData?.enterpriseId);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    hasEnterprise,
    login,
    logout,
    setUser: updateUser
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 