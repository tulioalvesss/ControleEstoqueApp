const express = require('express');
const router = express.Router();
const { 
  createComponent,
  updateComponent,
  getComponents,
  deleteComponent,
  getAvailableComponents,
  getComponentById
} = require('../controllers/stockComponentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Rota para buscar componentes disponíveis
router.get('/available', getAvailableComponents);

// Rota para buscar componentes por ID
router.get('/product/:id', getComponentById);

// Rotas base
router.route('/')
  .post(createComponent);

router.route('/:id')
  .put(updateComponent)
  .delete(deleteComponent);

router.get('/stock/:stockId', getComponents);

module.exports = router; 