import React from 'react';
import { IconButton, Badge, Tooltip, keyframes, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const shakeAnimation = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-15deg); }
  80% { transform: rotate(15deg); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const StyledNotificationIcon = styled(NotificationsIcon)(({ theme, animate }) => ({
  animation: animate ? `${pulseAnimation} 1s ease-in-out` : 'none',
  animationIterationCount: 3,
  color: animate ? theme.palette.error.main : 'inherit'
}));

const StyledBadge = styled(Badge)(({ theme, animate }) => ({
  '& .MuiBadge-badge': {
    animation: animate ? `${shakeAnimation} 1s ease-in-out` : 'none',
    animationIterationCount: 3,
    backgroundColor: theme.palette.error.main
  }
}));

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, hasNewNotifications, lastNotification } = useNotifications();

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/notificacoes')}
          sx={{
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          <StyledBadge 
            badgeContent={notifications.length} 
            color="error"
            animate={hasNewNotifications.toString()}
          >
            <StyledNotificationIcon animate={hasNewNotifications.toString()} />
          </StyledBadge>
        </IconButton>
      </Tooltip>

      <Snackbar
        open={hasNewNotifications}
        autoHideDuration={3000}
        message={`Nova notificação: ${lastNotification}`}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'primary.main',
            fontWeight: 'medium'
          }
        }}
      />
    </>
  );
};

export default NotificationBell;