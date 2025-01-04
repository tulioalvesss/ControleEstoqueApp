import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [lastNotification, setLastNotification] = useState('');
  const previousNotifications = useRef([]);
  const audioRef = useRef(null);
  const reminderTimeoutRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    audioRef.current = new Audio('/sounds/notificacao.mp3');
    audioRef.current.load();
  }, []);

  const playNotificationSound = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Erro ao tocar som:', error);
    }
  };

  const showNotificationReminder = () => {
    if (notifications.some(n => !n.read)) {
      setHasNewNotifications(true);
      playNotificationSound();

      setTimeout(() => {
        setHasNewNotifications(false);
      }, 3000);

      // Agenda o próximo lembrete
      scheduleNextReminder();
    }
  };

  const scheduleNextReminder = () => {
    // Limpa o timeout anterior se existir
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }

    // Agenda novo lembrete para 5 minutos (300000 ms)
    reminderTimeoutRef.current = setTimeout(() => {
      showNotificationReminder();
    }, 300000);
  };

  const checkNewNotifications = (newNotifications) => {
    const prevIds = new Set(previousNotifications.current.map(n => n.id));
    const hasNew = newNotifications.some(n => !prevIds.has(n.id));

    if (hasNew && newNotifications.length > 0) {
      setHasNewNotifications(true);
      setLastNotification(newNotifications[0].message);
      playNotificationSound();

      setTimeout(() => {
        setHasNewNotifications(false);
      }, 3000);

      // Agenda um lembrete se houver notificações não lidas
      if (newNotifications.some(n => !n.read)) {
        scheduleNextReminder();
      }
    }

    previousNotifications.current = newNotifications;
    setNotifications(newNotifications);
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      const data = await notificationService.getUnreadNotifications();
      checkNewNotifications(data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);

      // Limpa os intervalos e timeouts quando o componente for desmontado
      return () => {
        clearInterval(interval);
        if (reminderTimeoutRef.current) {
          clearTimeout(reminderTimeoutRef.current);
        }
      };
    }
  }, [isAuthenticated]);

  // Efeito para gerenciar lembretes quando as notificações mudam
  useEffect(() => {
    if (notifications.some(n => !n.read)) {
      scheduleNextReminder();
    } else if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        hasNewNotifications, 
        lastNotification,
        fetchNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};