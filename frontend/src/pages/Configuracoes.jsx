import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { categoryService } from '../services/categoryService';
import { supplierService } from '../services/supplierService';
import ModalEditSupplier from '../components/componentsSupplier/modalEditSupplier';

const Configuracoes = () => {
  const [minStock, setMinStock] = useState(10);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = async () => {
    try {
      const [categoriesData, suppliersData] = await Promise.all([
        categoryService.getAll(),
        supplierService.getAll()
      ]);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleAddSupplier = async () => {
    if (selectedCategory && newSupplier.name) {
      try {
        const createdSupplier = await supplierService.create({
          name: newSupplier.name,
          email: newSupplier.email,
          phone: newSupplier.phone,
          categoryId: selectedCategory
        });
        setSuppliers([...suppliers, createdSupplier]);
        setNewSupplier({ name: '', email: '', phone: '' });
        setSelectedCategory('');
      } catch (error) {
        console.error('Erro ao adicionar fornecedor:', error);
      }
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await supplierService.delete(id);
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const handleEditSupplier = async (id, updatedSupplier) => {
    try {
      await supplierService.update(id, {
        ...updatedSupplier,
        id: id
      });
      
      await loadData();
      setOpenEditModal(false);
    } catch (error) {
      console.error('Erro ao editar fornecedor:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Configurações
        </Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cadastro de Fornecedores
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Telefone"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button 
              variant="contained" 
              onClick={handleAddSupplier}
              sx={{ mb: 2 }}
            >
              Adicionar Fornecedor
            </Button>

            {suppliers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Fornecedores Cadastrados:
                </Typography>
                {suppliers.map((supplier) => (
                  <Box 
                    key={supplier.id} 
                    sx={{ 
                      mb: 2,
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {supplier.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Categoria: {getCategoryName(supplier.categoryId)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {supplier.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Telefone: {supplier.phone}
                      </Typography>
                    </Box>
                    <Box>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setOpenEditModal(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        Excluir
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Sobre o Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Controle de Estoque para a sua empresa!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Versão: 0.2.0
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Desenvolvido por: Controle de Estoque LTDA
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <ModalEditSupplier
        open={openEditModal}
        handleClose={() => {
          setOpenEditModal(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
        categories={categories}
        onEdit={handleEditSupplier}
      />
    </MainLayout>
  );
};

export default Configuracoes;
