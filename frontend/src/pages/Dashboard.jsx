import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { stockService } from '../services/stockService';
import { stockComponentService } from '../services/stockComponentsService';
import ChartDashboard from '../components/chardDashboard';

const Dashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalValue: 0,
    loading: true
  });
  const [stockComponents, setStockComponents] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true }));
    try {
      const sectorData = await stockService.getStockComponentsAll();
      
      // Busca os componentes de estoque para cada setor
      const stockComponentsPromises = sectorData.map(sector => 
        stockComponentService.getStockComponentsStock(sector.id)
      );
      const stockComponentsResults = await Promise.all(stockComponentsPromises);
      
      // Combina todos os componentes em um único array
      const allStockComponents = stockComponentsResults.flat();
      setStockComponents(allStockComponents);

      
      const totalProducts = allStockComponents.length;
      const lowStockProducts = allStockComponents.filter(
        component => component.quantity <= component.minQuantity
      ).length;
      const totalValue = allStockComponents.reduce(
        (acc, curr) => acc + (curr.price * curr.quantity), 
        0
      );

      setDashboardData({
        totalProducts,
        lowStockProducts,
        totalValue,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const DashboardCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Dashboard</Typography>
        <IconButton onClick={loadDashboardData} disabled={dashboardData.loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {dashboardData.loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Total de Produtos"
            value={dashboardData.totalProducts}
            icon={<InventoryIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Itens com Estoque Baixo"
            value={dashboardData.lowStockProducts}
            icon={<WarningIcon sx={{ color: theme.palette.warning.main }} />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: theme.shadows[2]
            }}
          >
            <ChartDashboard stockComponents={stockComponents} />
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;