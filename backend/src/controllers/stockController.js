const Stock = require('../models/Stock');
const Sector = require('../models/Sector');
const { Op } = require('sequelize');

exports.createStock = async (req, res) => {
  try {
    const { name, quantity, sectorId, minQuantity } = req.body;
    const enterpriseId = req.user.enterpriseId;

    // Verifica se o setor existe e pertence à empresa
    const sector = await Sector.findOne({
      where: { 
        id: sectorId,
        enterpriseId
      }
    });

    if (!sector) {
      return res.status(404).json({ message: 'Setor não encontrado' });
    }

    // Verifica se já existe um item com o mesmo nome no mesmo setor
    const existingStock = await Stock.findOne({
      where: { 
        name,
        sectorId,
        enterpriseId
      }
    });

    if (existingStock) {
      return res.status(400).json({ message: 'Já existe um item com este nome neste setor' });
    }

    const stock = await Stock.create({
      name,
      quantity,
      sectorId,
      enterpriseId,
      minQuantity: minQuantity || 10
    });

    // Retorna o item criado com os dados do setor
    const stockWithSector = await Stock.findByPk(stock.id, {
      include: [{
        model: Sector,
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json(stockWithSector);
  } catch (error) {
    console.error('Erro ao criar item em estoque:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

exports.getStockItems = async (req, res) => {
  try {
    const items = await Stock.findAll({
      where: { enterpriseId: req.user.enterpriseId },
      include: [{
        model: Sector,
        attributes: ['id', 'name']
      }]
    });
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Erro ao buscar itens em estoque:', error);
    res.status(500).json({ message: 'Erro ao buscar itens em estoque', error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, sectorId, minQuantity } = req.body;
    const enterpriseId = req.user.enterpriseId;

    const stock = await Stock.findOne({
      where: { 
        id,
        enterpriseId
      }
    });

    if (!stock) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Se estiver mudando o setor, verifica se o novo setor existe
    if (sectorId && sectorId !== stock.sectorId) {
      const sector = await Sector.findOne({
        where: { 
          id: sectorId,
          enterpriseId
        }
      });

      if (!sector) {
        return res.status(404).json({ message: 'Setor não encontrado' });
      }
    }

    // Verifica se já existe outro item com o mesmo nome no mesmo setor
    if (name && name !== stock.name) {
      const existingStock = await Stock.findOne({
        where: { 
          name,
          sectorId: sectorId || stock.sectorId,
          enterpriseId,
          id: { [Op.ne]: id }
        }
      });

      if (existingStock) {
        return res.status(400).json({ message: 'Já existe um item com este nome neste setor' });
      }
    }

    await stock.update({
      name,
      quantity,
      sectorId,
      minQuantity
    });

    const updatedStock = await Stock.findByPk(id, {
      include: [{
        model: Sector,
        attributes: ['id', 'name']
      }]
    });

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(400).json({ message: error.message });
  }
};