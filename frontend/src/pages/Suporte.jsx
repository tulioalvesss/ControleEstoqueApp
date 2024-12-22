import { Box, Typography, Card, CardContent, Grid, IconButton, useTheme, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HelpIcon from '@mui/icons-material/Help';

const Suporte = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
    <Button 
      variant="contained" 
      color="primary" 
      onClick={() => window.history.back()}
    >
      Voltar
    </Button>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, color: theme.palette.primary.main }}>
        Como Podemos Ajudar?
      </Typography>

      <Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>
        Estamos aqui para ajudar! Escolha o canal de atendimento que preferir:
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 5
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconButton color="primary" sx={{ mb: 2 }}>
                <WhatsAppIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                WhatsApp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atendimento rápido via WhatsApp<br />
                (11) 99999-9999
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 5
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconButton color="primary" sx={{ mb: 2 }}>
                <EmailIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                E-mail
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Suporte 24/7 via e-mail<br />
                suporte@empresa.com
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 5
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconButton color="primary" sx={{ mb: 2 }}>
                <SupportAgentIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                Chat Online
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chat em tempo real<br />
                Seg-Sex 8h às 18h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 5
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconButton color="primary" sx={{ mb: 2 }}>
                <HelpIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                FAQ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Perguntas Frequentes<br />
                Base de Conhecimento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="primary">
          Horário de Atendimento
        </Typography>
        <Typography variant="body1">
          Segunda a Sexta: 8h às 18h<br />
          Sábado: 9h às 13h
        </Typography>
      </Box>
    </Box>
  );
};

export default Suporte;
