import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { sectorService } from '../services/sectorService';
import { stockComponentService } from '../services/stockComponentsService';
import { productComponentsService } from '../services/productComponentsService';
import MainLayout from '../components/layout/MainLayout';

const Estoque = () => {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingComponent, setEditingComponent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [productComponents, setProductComponents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    minQuantity: '',
    unit: '' // Nova propriedade para unidade de medida
  });

  useEffect(() => {
    loadSectors();
    loadProductComponents();
  }, []);

  const loadSectors = async () => {
    try {
      const sectors = await sectorService.getSectors();
      setSectors(sectors);
      if (sectors.length > 0) {
        setSelectedSector(sectors[0].id);
      }
    } catch (error) {
      setError('Erro ao carregar setores');
      console.error('Erro ao carregar setores:', error);
    }
  };

  const loadProductComponents = async () => {
    try {
      const components = await productComponentsService.getProductComponents();
      setProductComponents(components);
    } catch (error) {
      console.error('Erro ao carregar componentes dos produtos:', error);
    }
  };

  const handleOpenDialog = (component = null) => {
    if (component) {
      setEditingComponent(component);
      setFormData({
        name: component.name,
        quantity: component.quantity,
        minQuantity: component.minQuantity,
        unit: component.unit || ''
      });
    } else {
      setEditingComponent(null);
      setFormData({
        name: '',
        quantity: '',
        minQuantity: '',
        unit: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingComponent(null);
    setFormData({
      name: '',
      quantity: '',
      minQuantity: '',
      unit: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentSector = sectors.find(s => s.id === selectedSector);
      if (!currentSector || !currentSector.stock) {
        throw new Error('Estoque não encontrado para este setor');
      }

      const data = {
        ...formData,
        stockId: currentSector.stock.id
      };

      if (editingComponent) {
        await stockComponentService.updateComponent(editingComponent.id, data);
        setSuccess('Componente atualizado com sucesso!');
      } else {
        await stockComponentService.createComponent(data);
        setSuccess('Componente adicionado com sucesso!');
      }

      handleCloseDialog();
      loadSectors();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar componente');
      console.error('Erro ao salvar componente:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Estoque
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Componentes do Estoque" />
          <Tab label="Uso em Produtos" />
        </Tabs>

        {tabValue === 0 ? (
          <>
            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel>Setor</InputLabel>
                <Select
                  value={selectedSector}
                  label="Setor"
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  {sectors?.map((sector) => (
                    <MenuItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 1 }}
              >
                Adicionar Componente
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Unidade</TableCell>
                    <TableCell align="right">Quantidade Mínima</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectors
                    ?.find(s => s.id === selectedSector)
                    ?.stock?.components?.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell align="right">{component.quantity}</TableCell>
                        <TableCell align="right">{component.unit}</TableCell>
                        <TableCell align="right">{component.minQuantity}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(component)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Componente</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade Usada</TableCell>
                  <TableCell align="right">Unidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productComponents.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell>{pc.component?.name}</TableCell>
                    <TableCell>{pc.product?.name}</TableCell>
                    <TableCell align="right">{pc.quantity}</TableCell>
                    <TableCell align="right">{pc.component?.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {editingComponent ? 'Editar Componente' : 'Novo Componente'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Nome do Componente"
                type="text"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="quantity"
                label="Quantidade"
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="unit"
                label="Unidade de Medida"
                type="text"
                fullWidth
                value={formData.unit}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="minQuantity"
                label="Quantidade Mínima"
                type="number"
                fullWidth
                value={formData.minQuantity}
                onChange={handleChange}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button type="submit" variant="contained">
                Salvar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default Estoque;
