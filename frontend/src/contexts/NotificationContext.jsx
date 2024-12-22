import React, { createContext, useState, useContext, useEffect } from 'react';
import { getNotifications } from '../services/notificationService';
import { subscribeToNotifications, connectSocket, disconnectSocket } from '../services/socketService';
import { audioService } from '../services/audioService';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loadNotifications: () => {},
  addNotification: () => {},
  soundEnabled: true,
  toggleSound: () => {}
});

export const NotificationProvider = ({ children, pollingInterval = 30000 }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('notificationSound') !== 'disabled';
  });

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('notificationSound', newState ? 'enabled' : 'disabled');
  };

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      const unreadNotifications = data.filter(n => !n.read);
      const previousUnreadCount = notifications.filter(n => !n.read).length;
      const newUnreadCount = unreadNotifications.length;

      if (newUnreadCount > previousUnreadCount && soundEnabled) {
        audioService.playNotificationSound();
      }

      setLastNotificationCount(data.length);
      setNotifications(data);
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    connectSocket();
    
    subscribeToNotifications((newNotification) => {
      console.log('Nova notificação recebida:', newNotification);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      if (soundEnabled && !newNotification.read) {
        audioService.playNotificationSound();
      }
    });
    
    // Configurar o polling
    const intervalId = setInterval(() => {
      loadNotifications();
    }, pollingInterval);
    
    return () => {
      disconnectSocket();
      clearInterval(intervalId);
    };
  }, [pollingInterval]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loadNotifications,
      addNotification: (notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.read) {
          setUnreadCount(prev => prev + 1);
          if (soundEnabled) {
            audioService.playNotificationSound();
          }
        }
      },
      soundEnabled,
      toggleSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    console.warn('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};