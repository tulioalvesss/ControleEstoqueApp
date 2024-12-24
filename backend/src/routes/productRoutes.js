const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { Product, StockHistory, Notification } = require('../models/associations');

// Aplicar proteção em todas as rotas
router.use(protect);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.put('/:id/stock', protect, updateStock);

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, categoryId } = req.body;
    const enterpriseId = req.user.enterpriseId;

    const product = await Product.findOne({
      where: { id, enterpriseId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const oldQuantity = product.quantity;
    
    // Atualiza o produto
    await product.update({
      name,
      description,
      price,
      quantity,
      categoryId
    });

    // Cria histórico de estoque se a quantidade foi alterada
    if (oldQuantity !== quantity) {
      await StockHistory.create({
        productId: id,
        oldQuantity,
        newQuantity: quantity,
        type: quantity > oldQuantity ? 'entrada' : 'saida',
        difference: Math.abs(quantity - oldQuantity)
      });

      // Verifica se o estoque está baixo (menor que 20)
      if (quantity < 20) {
        // Verifica se já existe uma notificação não lida para este produto
        const existingNotification = await Notification.findOne({
          where: {
            productId: id,
            type: 'low_stock',
            read: false,
            enterpriseId
          }
        });

        // Só cria nova notificação se não existir uma não lida
        if (!existingNotification) {
          const notification = await Notification.create({
            message: `Produto ${product.name} está com estoque baixo (${quantity} unidades)`,
            type: 'low_stock',
            productId: id,
            enterpriseId
          });

          // Emite evento de nova notificação via WebSocket
          const io = req.app.get('io');
          if (io) {
            io.emit('newNotification', notification);
          }
        }
      }
    }

    res.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
});

module.exports = router; 