import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { productService } from '../../services/productService';

const ModalEditProduct = ({ open, handleClose, product, onSuccess }) => {
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    minQuantity: '',
    sendEmailAlert: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        minQuantity: product.minQuantity || '',
        sendEmailAlert: Boolean(product.sendEmailAlert)
      });
    } else {
      setFormData(initialFormState);
    }
  }, [product]);

  const handleCloseModal = () => {
    setFormData(initialFormState);
    setError('');
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        price: Number(formData.price) || 0,
        quantity: Number(formData.quantity) || 0,
        minQuantity: Number(formData.minQuantity) || 0,
        sendEmailAlert: Boolean(formData.sendEmailAlert)
      };

      await productService.update(product.id, updatedData);
      onSuccess();
      handleCloseModal();
    } catch (err) {
      setError('Erro ao atualizar produto');
      console.error(err);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseModal}
      aria-labelledby="edit-product-dialog"
    >
      <DialogTitle>Editar Produto</DialogTitle>
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
          label="Nome do Produto"
          type="text"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({
            ...formData,
            name: e.target.value
          })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Descrição"
          type="text"
          fullWidth
          value={formData.description}
          onChange={(e) => setFormData({
            ...formData,
            description: e.target.value
          })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="price"
          label="Preço"
          type="number"
          fullWidth
          value={formData.price}
          onChange={(e) => setFormData({
            ...formData,
            price: e.target.value
          })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="quantity"
          label="Quantidade"
          type="number"
          fullWidth
          value={formData.quantity}
          onChange={(e) => setFormData({
            ...formData,
            quantity: e.target.value
          })}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.sendEmailAlert}
              onChange={(e) => setFormData({
                ...formData,
                sendEmailAlert: e.target.checked
              })}
            />
          }
          label="Enviar alerta por email quando estoque estiver baixo"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditProduct;
