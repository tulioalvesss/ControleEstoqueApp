import React, { useContext } from 'react';
import { Box, Card, CardContent, Typography, Switch, FormControlLabel } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

const Configuracoes = () => {
  return (
    <MainLayout>
      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Configurações
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Notificações
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Sobre o Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Controle de Estoque para a sua empresa!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Versão: 0.2.0
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Desenvolvido por: Controle de Estoque LTDA
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default Configuracoes;
