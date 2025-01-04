const express = require('express');
const router = express.Router();
const productComponentController = require('../controllers/productComponentController');

router.post('/', productComponentController.createProductComponent);
router.get('/:productId', productComponentController.getProductComponents);
router.put('/:id', productComponentController.updateProductComponent);
router.delete('/:id', productComponentController.deleteProductComponent);
router.get('/', productComponentController.getAllComponents);
module.exports = router;