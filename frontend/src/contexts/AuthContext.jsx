import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasEnterprise, setHasEnterprise] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aqui você pode adicionar uma verificação do token com o backend
      setUser({ token });
    }
    setLoading(false);
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
      setUser(userData);
      setHasEnterprise(!!userData.enterpriseId);
      
      return {
        user: userData,
        hasEnterprise: !!userData.enterpriseId
      };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setHasEnterprise(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    setHasEnterprise(!!userData?.enterpriseId);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    hasEnterprise,
    login,
    logout,
    setUser: updateUser,
    signed: !!user
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 