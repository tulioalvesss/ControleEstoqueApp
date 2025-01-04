import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, Divider, Badge } from '@mui/material';
import { Dashboard, Inventory, BarChart, People, Settings, Help } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Bell } from '@phosphor-icons/react';
import { useNotifications } from '../../contexts/NotificationContext';
import { styled } from '@mui/material/styles';

const AnimatedBell = styled(Bell)(({ theme, hasnew }) => ({
  animation: hasnew === 'true' ? 'shake 0.5s ease-in-out infinite' : 'none',
  '@keyframes shake': {
    '0%, 100%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(-10deg)' },
    '75%': { transform: 'rotate(10deg)' }
  }
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const { notifications, hasNewNotifications } = useNotifications();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Produtos', icon: <Inventory />, path: '/produtos' },
    { text: 'Setores', icon: <Inventory />, path: '/setores' },
    { text: 'Estoque', icon: <Inventory />, path: '/estoque' },
    { text: 'Usuários', icon: <People />, path: '/usuarios' },
    { text: 'Relatórios', icon: <BarChart />, path: '/relatorios' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
    { text: 'Suporte', icon: <Help />, path: '/suporte' },
    { 
      text: 'Notificações', 
      icon: (
        <Badge badgeContent={notifications.length} color="error">
          <AnimatedBell 
            size={24} 
            weight="fill"
            hasnew={hasNewNotifications.toString()}
          />
        </Badge>
      ), 
      path: '/notificacoes' 
    },
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
      </List>
    </Drawer>
  );
};

export default Sidebar;