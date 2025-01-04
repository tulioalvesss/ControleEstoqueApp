const express = require('express');
const router = express.Router();
const { 
  createStock, 
  getStockItems, 
  updateStock 
} = require('../controllers/stockController');
const { protect } = require('../middlewares/authMiddleware');

// Aplicar proteção em todas as rotas
router.use(protect);

// Rotas para itens do estoque
router.route('/')
  .get(getStockItems)
  .post(createStock);

router.route('/:id')
  .put(updateStock);

module.exports = router;