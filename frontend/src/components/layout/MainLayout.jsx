import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            minHeight: '100vh',
            bgcolor: '#f5f5f5'
          }}
        >
          {children}
        </Box>
      </Box>
  );
};

export default MainLayout; 