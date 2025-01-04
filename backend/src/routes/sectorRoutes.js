const express = require('express');
const router = express.Router();
const { 
  createSector, 
  getSectors, 
  updateSector, 
  deleteSector 
} = require('../controllers/sectorController');
const { protect } = require('../middlewares/authMiddleware');

// Aplicar proteção em todas as rotas
router.use(protect);

// Rotas para setores
router.route('/')
  .get(getSectors)
  .post(createSector);

router.route('/:id')
  .put(updateSector)
  .delete(deleteSector);

module.exports = router;