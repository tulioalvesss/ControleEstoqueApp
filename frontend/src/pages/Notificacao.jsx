import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Divider, Badge, Tooltip } from '@mui/material';
import { Check, Warning, Info, Delete, VolumeUp, VolumeOff } from '@mui/icons-material';
import { getNotifications, markAsRead, deleteNotification } from '../services/notificationService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainLayout from '../components/layout/MainLayout';
import { useNotifications } from '../contexts/NotificationContext';

const Notificacao = () => {
  const [notifications, setNotifications] = useState([]);
  const { loadNotifications, soundEnabled, toggleSound } = useNotifications();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <Warning sx={{ color: '#ff9800' }} />;
      case 'error':
        return <Warning sx={{ color: '#f44336' }} />;
      default:
        return <Info sx={{ color: '#2196f3' }} />;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper 
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 600,
              color: '#1a237e',
              mb: 4,
              textAlign: 'center'
            }}>
              Central de Notificações
            </Typography>
            <Tooltip title={soundEnabled ? "Desativar som" : "Ativar som"}>
              <IconButton onClick={toggleSound} color="primary">
                {soundEnabled ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
            </Tooltip>
          </Box>

          <List sx={{ width: '100%' }}>
            {notifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    borderRadius: 2,
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      bgcolor: 'rgba(25, 118, 210, 0.12)'
                    }
                  }}
                  secondaryAction={
                    <Box>
                      {!notification.read && (
                        <Tooltip title="Marcar como lida">
                          <IconButton 
                            onClick={() => handleMarkAsRead(notification.id)}
                            sx={{ 
                              color: '#4caf50',
                              mr: 1,
                              '&:hover': {
                                bgcolor: 'rgba(76, 175, 80, 0.1)'
                              }
                            }}
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Excluir notificação">
                        <IconButton 
                          onClick={() => handleDelete(notification.id)}
                          sx={{ 
                            color: '#f44336',
                            '&:hover': {
                              bgcolor: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <Badge 
                    color="error" 
                    variant="dot" 
                    invisible={notification.read}
                    sx={{ mr: 2 }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Badge>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: notification.read ? 400 : 600,
                          color: '#1a237e'
                        }}
                      >
                        {notification.message}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="caption" 
                        sx={{ color: 'text.secondary' }}
                      >
                        {format(new Date(notification.createdAt), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider variant="inset" component="li" sx={{ ml: 0 }} />
                )}
              </Box>
            ))}
            {notifications.length === 0 && (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                p={4}
              >
                <Info sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma notificação encontrada
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default Notificacao;