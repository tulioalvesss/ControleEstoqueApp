import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Users from './pages/Users';
import PrivateRoute from './components/PrivateRoute';
import HomeSaaS from './pages/HomeSaaS';
import Relatorios from './pages/Relatorios';
import Suporte from './pages/Suporte';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';
import EnterpriseRegistration from './pages/EnterpriseRegistration';
import Setores from './pages/Setores';
import Estoque from './pages/Estoque';
import Notificacoes from './pages/Notificacoes';

function AppRoutes() {
  const { signed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Só redireciona para dashboard se estiver na rota inicial ou login
    if (signed && (window.location.pathname === '/' || window.location.pathname === '/login')) {
      navigate('/dashboard');
    }
  }, [signed, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomeSaaS />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/estoque"
        element={
          <PrivateRoute>
            <Estoque />
          </PrivateRoute>
        }
      />
      <Route
        path="/notificacoes"
        element={
          <PrivateRoute>
            <Notificacoes />
          </PrivateRoute>
        }
      />
      <Route
        path="/setores"
        element={
          <PrivateRoute>
            <Setores />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Configuracoes />
          </PrivateRoute>
        }
      />
      <Route
        path="/enterprise-registration"
        element={
          <PrivateRoute>
            <EnterpriseRegistration />
          </PrivateRoute>
        }
      />
      <Route
        path="/produtos"
        element={
          <PrivateRoute>
            <Produtos />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <Relatorios />
          </PrivateRoute>
        }
      />
      <Route
        path="/suporte"
        element={
          <PrivateRoute>
            <Suporte />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes; 