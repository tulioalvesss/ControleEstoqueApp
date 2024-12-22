const express = require('express');
const router = express.Router();
const {
  createEnterprise,
  getEnterprise,
  updateEnterprise,
  addUser,
  removeUser,
  getEnterpriseDetails
} = require('../controllers/enterpriseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Todas as rotas precisam de autenticação
router.use(protect);

// Criar empresa (qualquer usuário sem empresa pode criar)
router.post('/', createEnterprise);

// Rotas que precisam que o usuário pertença a uma empresa e seja admin
router.get('/', authorize('admin'), getEnterprise);
router.get('/details', authorize('admin'), getEnterpriseDetails);
router.put('/', authorize('admin'), updateEnterprise);
router.post('/users', authorize('admin'), addUser);
router.delete('/users/:userId', authorize('admin'), removeUser);

module.exports = router;
