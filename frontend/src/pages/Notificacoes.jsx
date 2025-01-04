import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  Paper, 
  IconButton, 
  Chip,
  Fade,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Check, 
  Warning, 
  Info, 
  Trash, 
  Bell 
} from '@phosphor-icons/react';
import { useNotifications } from '../contexts/NotificationContext';
import { notificationService } from '../services/notificationService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNotificationIcon = (type) => {
    const iconProps = { size: 24, weight: "fill" };
    switch (type) {
      case 'warning':
        return <Warning color="#ff9800" {...iconProps} />;
      case 'low_stock':
        return <Warning color="#f44336" {...iconProps} />;
      case 'info':
        return <Info color="#2196f3" {...iconProps} />;
      default:
        return <Bell color="#4caf50" {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return '#fff3e0';
      case 'low_stock':
        return '#ffebee';
      case 'info':
        return '#e3f2fd';
      default:
        return '#e8f5e9';
    }
  };

  const getNotificationMessage = (type) => {
    switch (type) {
      case 'warning':
        return 'Estoque baixo';
      case 'low_stock':
        return 'Estoque crítico';
      case 'info':
        return 'Informação';
      default:
        return 'Notificação';
    }
  };

  

  return (
    <Fade in={true}>
      <ListItem
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: notification.read ? 'transparent' : getNotificationColor(notification.type),
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateX(10px)' : 'none',
          boxShadow: isHovered ? 3 : 1,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: notification.read ? 'transparent' : 'primary.main',
            borderRadius: '4px 0 0 4px'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ mr: 2 }}>
            {getNotificationIcon(notification.type)}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                {notification.message}
              </Typography>
              <Chip
                label={getNotificationMessage(notification.type)}
                size="small"
                sx={{ 
                  ml: 2,
                  bgcolor: getNotificationColor(notification.type),
                  color: 'text.secondary'
                }}
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {format(new Date(notification.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </Typography>
          </Box>

          {!notification.read && (
            <IconButton
              onClick={() => onMarkAsRead(notification.id)}
              sx={{
                color: 'primary.main',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s ease'
              }}
            >
              <Check weight="bold" />
            </IconButton>
          )}
        </Box>
      </ListItem>
    </Fade>
  );
};

const Notificacoes = () => {
  const { notifications, fetchNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    if (activeTab === 1) {
      getAllNotificationsByEnterprise();
    }
  }, [activeTab]);

  const getAllNotificationsByEnterprise = async () => {
    try {
      const allNotifications = await notificationService.getAllNotificationsByEnterprise();
      setAllNotifications(allNotifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      setLoading(true);
      await notificationService.markAsRead(id);
      await fetchNotifications();
      if (activeTab === 1) {
        await getAllNotificationsByEnterprise();
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = activeTab === 0 
    ? notifications.filter(n => !n.read)
    : allNotifications;

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Central de Notificações
          </Typography>
          {loading && <CircularProgress size={24} />}
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span>Não lidas</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Chip
                      label={notifications.filter(n => !n.read).length}
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              } 
            />
            <Tab label="Lidas" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <List>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              ) : (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'text.secondary'
                  }}
                >
                  <Bell size={48} weight="light" />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {activeTab === 0 
                      ? 'Nenhuma notificação não lida'
                      : 'Nenhuma notificação lida'}
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default Notificacoes;
