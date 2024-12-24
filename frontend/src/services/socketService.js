import io from 'socket.io-client';
import * as authService from './authService';

const socket = io('http://localhost:3000', {
  autoConnect: false,
  reconnection: true
});

export const connectSocket = () => {
  const user = authService.getUser();
  if (user && user.enterpriseId) {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('setEnterprise', user.enterpriseId);
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const subscribeToNotifications = (callback) => {
  socket.on('newNotification', callback);
};

export default socket;