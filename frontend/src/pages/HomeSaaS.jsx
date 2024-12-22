import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';

const HomeSaaS = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      title: 'Gestão de Estoque',
      description: 'Controle completo do seu inventário com atualizações em tempo real'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Segurança',
      description: 'Dados protegidos com as mais recentes tecnologias de segurança'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Performance',
      description: 'Sistema rápido e eficiente para otimizar suas operações'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      title: 'Suporte 24/7',
      description: 'Equipe de suporte disponível para ajudar quando precisar'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Sistema de Controle de Estoque
              </Typography>
              <Typography variant="h5" paragraph>
                A solução completa para gerenciar seu estoque de forma eficiente e inteligente
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  mt: 3,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Área do Cliente
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/src/utils/dashboard_example_1896x899.png"
                alt="Dashboard Preview"
                sx={{ 
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Recursos Principais
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Paper 
            elevation={3}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 4
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Pronto para Começar?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Experimente gratuitamente por 14 dias e descubra como podemos ajudar seu negócio
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/login')}
            >
              Criar Conta Grátis
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeSaaS;
