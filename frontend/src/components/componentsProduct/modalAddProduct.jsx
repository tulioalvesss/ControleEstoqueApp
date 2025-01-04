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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { productService } from '../../services/productService';
import { sectorService } from '../../services/sectorService';
import { productComponentsService } from '../../services/productComponentsService';

const ModalAddProduct = ({ open, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sectorId: '',
    sku: '',
    isComposite: true
  });

  const [sectors, setSectors] = useState([]);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [error, setError] = useState('');
  const [componentForm, setComponentForm] = useState({
    componentId: '',
    quantity: ''
  });

  useEffect(() => {
    if (open) {
      loadInitialData();
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        sectorId: '',
        sku: '',
        isComposite: true
      });
      setSelectedComponents([]);
      setError('');
    }
  }, [open]);

  const loadInitialData = async () => {
    try {
      setError('');
      const [sectorsData, componentsData] = await Promise.all([
        sectorService.getSectors(),
        productComponentsService.getAvailableComponents()
      ]);
      
      if (sectorsData) {
        setSectors(sectorsData);
      }
      
      if (componentsData) {
        setAvailableComponents(componentsData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados iniciais');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'sectorId') {
      setSelectedComponents([]);
      setComponentForm({ componentId: '', quantity: '' });
    }
  };

  const handleComponentFormChange = (e) => {
    const { name, value } = e.target;
    setComponentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addComponent = () => {
    if (!componentForm.componentId || !componentForm.quantity) {
      setError('Selecione um componente e especifique a quantidade');
      return;
    }

    const component = availableComponents.find(c => c.id === componentForm.componentId);
    if (!component) return;

    setSelectedComponents(prev => [
      ...prev,
      {
        componentId: component.id,
        name: component.name,
        quantity: Number(componentForm.quantity),
        unit: component.unit
      }
    ]);

    setComponentForm({ componentId: '', quantity: '' });
  };

  const removeComponent = (index) => {
    setSelectedComponents(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.name || !formData.sku || !formData.price || !formData.sectorId) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      if (selectedComponents.length === 0) {
        setError('Adicione pelo menos um componente ao produto');
        return;
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        components: selectedComponents
      };

      await productService.create(productData);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar produto');
    }
  };


  const filteredComponents = availableComponents.filter(
    component => String(component.Stock?.sectorId) === String(formData.sectorId)
  );


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Novo Produto Composto</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="name"
            label="Nome do Produto"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            name="description"
            label="Descrição"
            multiline
            rows={2}
            value={formData.description}
            onChange={handleChange}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="sku"
              label="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />

            <TextField
              name="price"
              label="Preço"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Setor</InputLabel>
            <Select
              name="sectorId"
              value={formData.sectorId}
              onChange={handleChange}
              label="Setor"
              required
            >
              {sectors.map((sector) => (
                <MenuItem key={sector.id} value={sector.id}>
                  {sector.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Componentes do Produto
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Componente</InputLabel>
              <Select
                name="componentId"
                value={componentForm.componentId}
                onChange={handleComponentFormChange}
                label="Componente"
                disabled={!formData.sectorId}
              >
                {filteredComponents.map((component) => (
                  <MenuItem key={component.id} value={component.id}>
                    {component.name} ({component.unit})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="quantity"
              label="Quantidade"
              type="number"
              value={componentForm.quantity}
              onChange={handleComponentFormChange}
              sx={{ width: 150 }}
              disabled={!formData.sectorId}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addComponent}
              disabled={!formData.sectorId}
            >
              Adicionar
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Componente</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Unidade</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedComponents.map((component, index) => (
                  <TableRow key={index}>
                    <TableCell>{component.name}</TableCell>
                    <TableCell align="right">{component.quantity}</TableCell>
                    <TableCell align="right">{component.unit}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeComponent(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Criar Produto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddProduct;
