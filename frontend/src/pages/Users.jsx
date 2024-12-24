import React, { useState, useEffect } from 'react';
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
  IconButton,
  Box,
  TextField
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { enterpriseUsersService } from '../services/enterpriseUsersService';
import ModalEditUser from '../components/componentsUser/modalEditUser.jsx';
import ModalAddUser from '../components/componentsUser/modalAddUser.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await enterpriseUsersService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleAdd = () => {
    setOpenAddModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await enterpriseUsersService.deleteUser(selectedUser.id);
      loadUsers();
      setOpenDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Erro ao excluir usuário');
      console.error(err);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleEditSuccess = () => {
    loadUsers();
  };
  
  const handleAddSuccess = () => {
    loadUsers();
    setOpenAddModal(false);
  };

  const getRoleLabel = (role) => {
    const roles = {
      'admin': 'Administrador',
      'manager': 'Gerente',
      'employee': 'Usuário',
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <MainLayout>
        <Typography>Carregando...</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="div">
                Usuários da Empresa
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Novo Usuário
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleLabel(user.role)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(user)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog 
        open={openDeleteModal} 
        onClose={handleCloseDeleteModal}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDeleteModal}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição */}
      <ModalEditUser
        open={openEditModal}
        handleClose={handleCloseEditModal}
        user={selectedUser}
        onSuccess={handleEditSuccess}
      />
      {/* Modal de Adição */}
      <ModalAddUser
        open={openAddModal}
        handleClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
      />
    </MainLayout>
  );
};

export default Users;
