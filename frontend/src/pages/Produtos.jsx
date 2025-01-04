import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { productService } from '../services/productService';
import { sectorService } from '../services/sectorService';
import { productComponentsService } from '../services/productComponentsService';
import ModalEditProduct from '../components/componentsProduct/modalEditProduct';
import ModalAddProduct from '../components/componentsProduct/modalAddProduct';
import { stockComponentService } from '../services/stockComponentsService';

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [sectors, setSectors] = useState({});
  const [productsBySector, setProductsBySector] = useState({});
  const [openComponentsModal, setOpenComponentsModal] = useState(false);
  const [productComponents, setProductComponents] = useState([]);

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = async () => {
    try {
      const [productsData, sectorsData] = await Promise.all([
        productService.getAll(),
        sectorService.getSectors()
      ]);

      const sectorsMap = sectorsData.reduce((acc, sector) => {
        acc[sector.id] = sector.name;
        return acc;
      }, {});
      
      setSectors(sectorsMap);
      setProducts(productsData);
      
      const groupedProducts = productsData.reduce((acc, product) => {
        const sectorName = sectorsMap[product.sectorId] || 'Sem Setor';
        if (!acc[sectorName]) {
          acc[sectorName] = [];
        }
        acc[sectorName].push(product);
        return acc;
      }, {});
      
      setProductsBySector(groupedProducts);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  const handleViewComponents = async (product) => {
    try {
      if (product.components && product.components.length > 0) {
        // Se o produto já tem os componentes carregados, use-os diretamente
        const componentsWithDetails = product.components.map(component => ({
          id: component.id,
          name: component.name,
          quantity: component.ProductComponent?.quantity || component.quantity,
          unit: component.unit,
          minQuantity: component.minQuantity
        }));

        setProductComponents(componentsWithDetails);
      } else {
        // Caso contrário, busque os componentes da API
        const components = await productComponentsService.getProductComponents(product.id);
        setProductComponents(components || []);
      }
      
      setSelectedProduct(product);
      setOpenComponentsModal(true);
    } catch (error) {
      console.error('Erro ao carregar componentes:', error);
      setProductComponents([]);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await productService.delete(selectedProduct.id);
      loadProductsAndCategories();
      setOpenDeleteModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir produto');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Card elevation={0} sx={{ mb: 3, bgcolor: 'primary.main', borderRadius: 2 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ color: 'white' }}>
              Gerenciamento de Produtos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModal(true)}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Novo Produto
            </Button>
          </Box>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <Box sx={{ p: 2, bgcolor: 'primary.light' }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Lista de Produtos
                </Typography>
              </Box>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell align="right">Preço</TableCell>
                        <TableCell>Setor</TableCell>
                        <TableCell align="center">Componentes</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell align="right">
                            R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{sectors[product.sectorId]}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleViewComponents(product)}
                              color="primary"
                            >
                              <InventoryIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(product)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(product)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <ModalEditProduct
          open={openEditModal}
          handleClose={() => setOpenEditModal(false)}
          product={selectedProduct}
          onSuccess={loadProductsAndCategories}
        />

        <ModalAddProduct
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
          onSuccess={loadProductsAndCategories}
        />

        <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openComponentsModal} 
          onClose={() => setOpenComponentsModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Componentes do Produto</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedProduct?.name}
            </Typography>
            {productComponents.length > 0 ? (
              <List dense>
                {productComponents.map((component, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={component.name}
                      secondary={`Quantidade: ${component.quantity} ${component.unit}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Nenhum componente cadastrado</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenComponentsModal(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default Produtos;
