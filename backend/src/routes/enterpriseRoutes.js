const express = require('express');
const router = express.Router();
const {
  create,
  update,
  getById,
  getEnterpriseDetails,
  addUser,
  removeUser
} = require('../controllers/enterpriseController');

const { protect, authorize } = require('../middlewares/authMiddleware');


// Rota para criar empresa - acessível por qualquer usuário autenticado sem empresa
router.post('/', protect, create);

// Rotas que requerem autenticação e permissão de admin
router.get('/users', protect, getEnterpriseDetails);
router.post('/users', protect, addUser);
router.delete('/users/:userId', protect, removeUser);

router.put('/:id', protect, authorize('admin'), update);
router.get('/:id', protect, authorize('admin'), getById);

module.exports = router;
