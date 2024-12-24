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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ModalEditProduct from '../components/componentsProduct/modalEditProduct';
import ModalAddProduct from '../components/componentsProduct/modalAddProduct';

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [categories, setCategories] = useState({});
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);

      // Criar um mapa de categorias por ID para fácil acesso
      const categoriesMap = categoriesData.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {});
      
      setCategories(categoriesMap);
      setProducts(productsData);
      
      // Organizar produtos por categoria usando o nome da categoria
      const groupedProducts = productsData.reduce((acc, product) => {
        const categoryName = categoriesMap[product.categoryId] || 'Sem Categoria';
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
      }, {});
      
      setProductsByCategory(groupedProducts);
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

  const handleCreate = () => {
    setOpenAddModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await productService.delete(selectedProduct.id);
      loadProductsAndCategories();
      setOpenDeleteModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir produto');
      console.error(err);
    }
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        {/* Cabeçalho Principal */}
        <Card 
          elevation={0}
          sx={{ 
            mb: 3, 
            bgcolor: 'primary.main',
            borderRadius: 2,
          }}
        >
          <Box 
            sx={{ 
              p: 2,
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              Gestão de Produtos
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => handleCreate()}
              sx={{ 
                borderRadius: 2,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              Novo Produto
            </Button>
          </Box>
        </Card>

        <Grid container spacing={3}>
          {/* Lista Principal de Produtos */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderTopLeftRadius: 1,
                  borderTopRightRadius: 1,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'medium'
                  }}
                >
                  Lista de Produtos
                </Typography>
              </Box>
              <CardContent>
                {products.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" color="textSecondary">
                      Nenhum produto cadastrado
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow
                          sx={{
                            bgcolor: 'primary.main',
                            '& th': { 
                              color: 'white',
                              fontWeight: 'bold',
                            }
                          }}
                        >
                          <TableCell>Nome</TableCell>
                          <TableCell>Descrição</TableCell>
                          <TableCell align="right">Preço</TableCell>
                          <TableCell align="center">Quantidade</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} hover>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontWeight: 'medium' }}>
                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {product.quantity < product.minQuantity ? (
                                  <Tooltip title="Estoque baixo">
                                    <WarningIcon color="warning" sx={{ mr: 1 }} />
                                  </Tooltip>
                                ) : null}
                                <Typography>{product.quantity}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={product.quantity > product.minQuantity ? "Normal" : "Baixo Estoque"}
                                color={product.quantity > product.minQuantity ? "success" : "warning"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEdit(product)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(product)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Produtos por Categoria */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'primary.light',
                  borderTopLeftRadius: 1,
                  borderTopRightRadius: 1,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 'medium'
                  }}
                >
                  Visão por Categorias
                </Typography>
              </Box>
              <CardContent>
                {Object.keys(productsByCategory).length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" color="textSecondary">
                      Nenhum produto cadastrado em categorias
                    </Typography>
                  </Box>
                ) : (
                  Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                    <Accordion
                      key={category}
                      sx={{
                        '&:before': { display: 'none' },
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 1,
                        '&.Mui-expanded': {
                          margin: '0 0 8px 0',
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ backgroundColor: 'background.default' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography sx={{ flexGrow: 1 }}>{category}</Typography>
                          <Chip
                            label={`${categoryProducts.length} produtos`}
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow
                                sx={{
                                  bgcolor: 'primary.main',
                                  '& th': { 
                                    color: 'white',
                                    fontWeight: 'bold',
                                  }
                                }}
                              >
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell align="right">Preço</TableCell>
                                <TableCell align="center">Quantidade</TableCell>
                                <TableCell align="center">Quantidade Mínima</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {categoryProducts.map((product) => (
                                <TableRow key={product.id} hover>
                                  <TableCell>{product.name}</TableCell>
                                  <TableCell>{product.description}</TableCell>
                                  <TableCell align="right">
                                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </TableCell>
                                  <TableCell align="center">{product.quantity}</TableCell>
                                  <TableCell align="center">Qtd. Mínima Cadastrada: {product.minQuantity}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Modal de Edição */}
      <ModalEditProduct
        open={openEditModal}
        handleClose={handleCloseEditModal}
        product={selectedProduct}
        onSuccess={loadProductsAndCategories}
      />

      {/* Modal de Adição */}
      <ModalAddProduct
        open={openAddModal}
        handleClose={handleCloseAddModal}
        onSuccess={loadProductsAndCategories}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default Produtos;
