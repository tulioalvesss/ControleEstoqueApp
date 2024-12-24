import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { enterpriseService } from '../services/enterpriseService';
import { useAuth } from '../contexts/AuthContext';

const EnterpriseRegistration = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await enterpriseService.create(formData);
      
      // Atualiza o contexto com os novos dados do usuário
      if (response.user) {
        setUser(response.user);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao cadastrar empresa:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Erro ao cadastrar empresa'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Cadastro de Empresa
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Para continuar, é necessário cadastrar sua empresa
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome da Empresa"
              required
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="CNPJ"
              required
              margin="normal"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Telefone"
              margin="normal"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />  
            <TextField
              fullWidth
              label="Endereço"
              margin="normal"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <TextField
              fullWidth
              label="Cidade"
              margin="normal"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <TextField
              fullWidth
              label="Estado"
              margin="normal"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Cadastrar Empresa'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EnterpriseRegistration; 