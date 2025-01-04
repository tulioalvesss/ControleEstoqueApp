import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Users from './pages/Users';
import PrivateRoute from './components/PrivateRoute';
import HomeSaaS from './pages/HomeSaaS';
import Relatorios from './pages/Relatorios';
import Suporte from './pages/Suporte';
import Perfil from './pages/Perfil';
import Notificacoes from './pages/Notificacao';
import Configuracoes from './pages/Configuracoes';
import EnterpriseRegistration from './pages/EnterpriseRegistration';
import  Setores  from './pages/Setores';
import Estoque from './pages/Estoque';

const theme = createTheme({
    palette: {
      primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
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
                path="/perfil"
                element={
                  <PrivateRoute>
                    <Perfil />
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
                path="/notificacoes"
                element={
                  <PrivateRoute>
                    <Notificacoes />
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
                path="/enterprise-registration"
                element={
                  <PrivateRoute>
                    <EnterpriseRegistration />
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
                path="/estoque"
                element={
                  <PrivateRoute>
                    <Estoque />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;