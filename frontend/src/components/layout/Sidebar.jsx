import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
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
    { text: 'Usuários', icon: <People />, path: '/usuarios' },
    { text: 'Relatórios', icon: <BarChart />, path: '/relatorios' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
    { text: 'Suporte', icon: <Help />, path: '/suporte' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          color: '#121212',
          bgcolor: '#e6e6e6',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)'
        },
      }}
    >
      <Toolbar sx={{ bgcolor: '#1E1E1E' }} />
      <List sx={{ padding: '16px 8px' }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: '12px',
              margin: '4px 0',
              padding: '12px 16px',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateX(4px)'
              },
              '& .MuiListItemIcon-root': {
                color: '#121212',
                minWidth: '40px'
              },
              '& .MuiListItemText-primary': {
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.2px'
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem 
          button
          onClick={() => navigate('/notificacoes')}
          sx={{
            borderRadius: '12px',
            margin: '4px 0',
            padding: '12px 16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateX(4px)'
            },
            '& .MuiListItemIcon-root': {
              color: '#121212',
              minWidth: '40px',
              position: 'relative'
            },
            '& .MuiListItemText-primary': {
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.2px'
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
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
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