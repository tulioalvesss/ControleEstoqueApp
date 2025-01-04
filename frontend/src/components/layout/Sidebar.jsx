import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, Divider } from '@mui/material';
import { Dashboard, Inventory, BarChart, People, Settings, Help } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const notificationContext = useNotifications();
  const unreadCount = notificationContext?.unreadCount || 0;

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Produtos', icon: <Inventory />, path: '/produtos' },
    { text: 'Setores', icon: <Inventory />, path: '/setores' },
    { text: 'Estoque', icon: <Inventory />, path: '/estoque' },
    { text: 'Usuários', icon: <People />, path: '/usuarios' },
    { text: 'Relatórios', icon: <BarChart />, path: '/relatorios' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
    { text: 'Suporte', icon: <Help />, path: '/suporte' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          color: '#ffffff',
          bgcolor: '#333333',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 10px'
        },
      }}
    >
      <Toolbar sx={{ bgcolor: '#333333', minHeight: '64px' }} />
      <List sx={{ padding: '0' }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: '8px',
              margin: '6px 0',
              padding: '14px 20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateX(6px)'
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
                minWidth: '40px'
              },
              '& .MuiListItemText-primary': {
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.3px'
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', margin: '10px 0' }} />
        <ListItem 
          button
          onClick={() => navigate('/notificacoes')}
          sx={{
            borderRadius: '8px',
            margin: '6px 0',
            padding: '14px 20px',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateX(6px)'
            },
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
              minWidth: '40px',
              position: 'relative'
            },
            '& .MuiListItemText-primary': {
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.3px'
            }
          }}
        >
          <ListItemIcon>
            <Bell size={24} />
            {unreadCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: 0,
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                {unreadCount}
              </Box>
            )}
          </ListItemIcon>
          <ListItemText primary="Notificações" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;