import { useState, useEffect } from 'react';
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
  MenuItem,
  Box,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const ModalAddProduct = ({ open, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    SKU: '' // Adicionado SKU ao estado inicial
  });

  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'quantity') {
      if (value === '' || (!isNaN(value) && value >= 0)) {
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateCategory = async () => {
    try {
      const createdCategory = await categoryService.create(newCategory);
      setCategories([...categories, createdCategory]);
      setFormData(prevState => ({
        ...prevState,
        categoryId: createdCategory.id
      }));
      setShowNewCategory(false);
      setNewCategory({ name: '', description: '' });
    } catch (err) {
      setError('Erro ao criar categoria');
      console.error(err);
    }
  };

  const validateForm = () => {
    const enterpriseId = localStorage.getItem('enterpriseId');
    
    if (!formData.name.trim()) {
      setError('Nome do produto é obrigatório');
      return false;
    }
    if (!formData.SKU.trim()) {
      setError('SKU é obrigatório');
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Preço deve ser maior que zero');
      return false;
    }
    if (!formData.quantity || Number(formData.quantity) < 0) {
      setError('Quantidade não pode ser negativa');
      return false;
    }
    if (!formData.categoryId) {
      setError('Categoria é obrigatória');
      return false;
    }

    // Validar se os IDs são números válidos
    if (isNaN(parseInt(formData.categoryId))) {
      setError('Categoria inválida');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!validateForm()) {
        return;
      }

      const enterpriseId = localStorage.getItem('enterpriseId');
      
      if (!enterpriseId) {
        setError('ID da empresa não encontrado');
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        sku: formData.SKU,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        categoryId: formData.categoryId,
        enterpriseId: Number(enterpriseId)
      };

      await productService.create(productData);
      onSuccess();
      handleClose();
      setFormData({
        name: '',
        description: '',
        SKU: '',
        price: '',
        quantity: '',
        categoryId: ''
      });
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar produto';
      setError(errorMessage);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 2
      }}>
        Adicionar Novo Produto
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 , marginTop: 2}}>
          <TextField
            autoFocus
            name="name"
            label="Nome do Produto"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
          />
          
          <TextField
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={3}
          />
          <Box>
            <TextField
              name="SKU"
              label="SKU"
              type="text"
              fullWidth
              required
              value={formData.SKU}
              onChange={handleChange}
              variant="outlined"
              error={!formData.SKU.trim()}
              helperText={!formData.SKU.trim() ? 'SKU é obrigatório' : ''}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="price"
              label="Preço"
              type="number"
              value={formData.price}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            
            <TextField
              name="quantity"
              label="Quantidade"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Box>

          <FormControl fullWidth variant="outlined">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              label="Categoria"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setShowNewCategory(!showNewCategory)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {showNewCategory ? 'Cancelar Nova Categoria' : 'Criar Nova Categoria'}
          </Button>

          {showNewCategory && (
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Nova Categoria
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  name="name"
                  label="Nome da Categoria"
                  type="text"
                  fullWidth
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  variant="outlined"
                />
                
                <TextField
                  name="description"
                  label="Descrição da Categoria"
                  type="text"
                  fullWidth
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />
                
                <Button
                  variant="contained"
                  onClick={handleCreateCategory}
                  disabled={!newCategory.name}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Criar Categoria
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.name || !formData.categoryId}
        >
          Adicionar Produto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddProduct;
