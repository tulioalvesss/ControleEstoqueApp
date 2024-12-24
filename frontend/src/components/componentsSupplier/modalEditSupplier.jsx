import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const ModalEditSupplier = ({ open, handleClose, supplier, categories, onEdit }) => {
  const [editedSupplier, setEditedSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    categoryId: ''
  });

  useEffect(() => {
    if (supplier) {
      setEditedSupplier({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        categoryId: supplier.categoryId || ''
      });
    }
  }, [supplier]);

  const handleSubmit = async () => {
    try {
      await onEdit(supplier.id, editedSupplier);
      handleClose();
    } catch (error) {
      console.error('Erro ao editar fornecedor:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Fornecedor</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={editedSupplier.categoryId}
            onChange={(e) => setEditedSupplier({...editedSupplier, categoryId: e.target.value})}
            label="Categoria"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Nome do Fornecedor"
          value={editedSupplier.name}
          onChange={(e) => setEditedSupplier({...editedSupplier, name: e.target.value})}
          fullWidth
          sx={{ mt: 2 }}
        />

        <TextField
          label="Email"
          value={editedSupplier.email}
          onChange={(e) => setEditedSupplier({...editedSupplier, email: e.target.value})}
          fullWidth
          sx={{ mt: 2 }}
        />

        <TextField
          label="Telefone"
          value={editedSupplier.phone}
          onChange={(e) => setEditedSupplier({...editedSupplier, phone: e.target.value})}
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditSupplier;
