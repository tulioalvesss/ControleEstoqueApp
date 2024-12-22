import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { enterpriseUsersService } from '../../services/enterpriseUsersService';

const ModalAddUser = ({ open, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await enterpriseUsersService.createUser(formData);
      onSuccess();
      handleClose();
      setFormData({
        name: '',
        email: '',
        role: ''
      });
    } catch (err) {
      setError('Erro ao criar usuário');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel>Tipo de Usuário</InputLabel>
          <Select
            name="role"
            value={formData.role}
            label="Tipo de Usuário"
            onChange={handleChange}
          >
            <MenuItem value="ADMIN">Administrador</MenuItem>
            <MenuItem value="MANAGER">Gerente</MenuItem>
            <MenuItem value="USER">Usuário</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddUser;
