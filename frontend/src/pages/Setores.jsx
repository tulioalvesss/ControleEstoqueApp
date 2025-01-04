import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
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
  TextField
} from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { sectorService } from '../services/sectorService';
import MainLayout from '../components/layout/MainLayout';

const Setores = () => {
  const [sectors, setSectors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSector, setNewSector] = useState({
    name: '',
    description: ''
  });

  const loadSectors = async () => {
    const data = await sectorService.getSectors();
    setSectors(data);
  };

  useEffect(() => {
    loadSectors();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewSector({ name: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSector(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await sectorService.create(newSector);
      loadSectors();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao criar setor:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Setores
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleOpenDialog}
          >
            Novo Setor
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data de Criação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell>{sector.name}</TableCell>
                  <TableCell>{sector.description}</TableCell>
                  <TableCell>
                    {new Date(sector.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Novo Setor</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                name="name"
                label="Nome do Setor"
                fullWidth
                value={newSector.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                name="description"
                label="Descrição"
                fullWidth
                multiline
                rows={3}
                value={newSector.description}
                onChange={handleInputChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={!newSector.name.trim()}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default Setores;
