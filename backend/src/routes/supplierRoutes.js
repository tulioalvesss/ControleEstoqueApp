const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/:enterpriseId', supplierController.getAll);
router.post('/', supplierController.create);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.delete);

module.exports = router;