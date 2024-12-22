import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Grid, Container, TextField, Button } from '@mui/material';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    enterpriseId: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const data = await userService.getProfile(userId);
        setUserData(data);
        setFormData({
          name: data.name,
          email: data.email
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await userService.updateUser(userId, formData);
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  const getRoleName = (role) => {
    const roles = {
      admin: 'Administrador',
      manager: 'Gerente',
      employee: 'Funcionário'
    };
    return roles[role] || role;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          variant="outlined"
          color="primary"
        >
          Voltar
        </Button>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                sx={{ 
                  width: 150, 
                  height: 150,
                  mb: 2,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                alt={userData.name}
                src="/static/images/avatar/default.jpg"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography 
                variant="h4" 
                align="center" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: '#1a237e'
                }}
              >
                {!isEditing ? userData.name : 'Editando Perfil'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Nome:
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem' }}>
                  {userData.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Email:
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem' }}>
                  {userData.email}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Cargo:
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ 
                fontSize: '1.1rem',
                color: '#1a237e',
                fontWeight: 500
              }}>
                {getRoleName(userData.role)}
              </Typography>
            </Grid>

            {userData.enterpriseId && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  Nome da Empresa:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  {userData.enterprise.name}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} display="flex" justifyContent="center" sx={{ mt: 2 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mr: 2 }}
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0d47a1 30%, #1565c0 90%)'
                    }
                  }}
                >
                  Editar Perfil
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Perfil;
