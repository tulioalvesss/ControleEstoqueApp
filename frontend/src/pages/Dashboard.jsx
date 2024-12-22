import { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { productService } from '../services/productService';
import ChartDashboard from '../components/chardDashboard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalValue: 0
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const productsData = await productService.getAll();
      setProducts(productsData);

      const totalProducts = productsData.length;
      const lowStockProducts = productsData.filter(p => p.quantity <= p.minQuantity).length;
      const totalValue = productsData.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

      setDashboardData({
        totalProducts,
        lowStockProducts,
        totalValue
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  return (
    <MainLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total de Produtos
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalProducts}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Produtos com Estoque Baixo
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.lowStockProducts}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Valor Total em Estoque
            </Typography>
            <Typography component="p" variant="h4">
              R$ {dashboardData.totalValue.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráfico de Quantidade em Estoque */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mt: 3 }}>
          <ChartDashboard products={products} showOnlyQuantity={true} />
        </Paper>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;