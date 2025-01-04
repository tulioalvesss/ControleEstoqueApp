const StockComponent = require('../models/StockComponent');
const Stock = require('../models/Stock');
const notificationController = require('./notificationController');
const { Op } = require('sequelize');

exports.createComponent = async (req, res) => {
  try {
    const { stockId, name, quantity, minQuantity, unit } = req.body;
    const enterpriseId = req.user.enterpriseId;

    // Verifica se o stock existe e pertence à empresa
    const stock = await Stock.findOne({
      where: { 
        id: stockId,
        enterpriseId
      }
    });

    if (!stock) {
      return res.status(404).json({ message: 'Estoque não encontrado' });
    }

    const component = await StockComponent.create({
      stockId,
      name,
      quantity,
      minQuantity,
      unit
    });

    res.status(201).json(component);
  } catch (error) {
    console.error('Erro ao criar componente:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, minQuantity, unit } = req.body;
    const enterpriseId = req.user.enterpriseId;

    const component = await StockComponent.findOne({
      include: [{
        model: Stock,
        where: { enterpriseId }
      }],
      where: { id }
    });

    if (!component) {
      return res.status(404).json({ message: 'Componente não encontrado' });
    }

    await component.update({
      name,
      quantity,
      minQuantity,
      unit
    });

    res.status(200).json(component);
  } catch (error) {
    console.error('Erro ao atualizar componente:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getComponents = async (req, res) => {
  try {
    const { stockId } = req.params;
    const enterpriseId = req.user.enterpriseId;

    const components = await StockComponent.findAll({
      include: [{
        model: Stock,
        where: { 
          enterpriseId,
          ...(stockId && { id: stockId })
        }
      }]
    });

    res.status(200).json(components);
  } catch (error) {
    console.error('Erro ao buscar componentes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const enterpriseId = req.user.enterpriseId;

    const component = await StockComponent.findOne({
      include: [{
        model: Stock,
        where: { enterpriseId }
      }],
      where: { id }
    });

    if (!component) {
      return res.status(404).json({ message: 'Componente não encontrado' });
    }

    await component.destroy();
    res.status(200).json({ message: 'Componente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir componente:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableComponents = async (req, res) => {
  try {
    const enterpriseId = req.user.enterpriseId;

    const components = await StockComponent.findAll({
      include: [{
        model: Stock,
        where: { 
          enterpriseId
        },
        attributes: ['id', 'name', 'sectorId']
      }],
      where: {
        quantity: {
          [Op.gt]: 0 // Apenas componentes com quantidade maior que 0
        }
      },
      attributes: ['id', 'name', 'quantity', 'unit', 'minQuantity']
    });

    res.status(200).json(components);
  } catch (error) {
    console.error('Erro ao buscar componentes disponíveis:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar componentes disponíveis',
      error: error.message 
    });
  }
}; 

exports.getComponentById = async (req, res) => {
  const { id } = req.params;
  const component = await StockComponent.findByPk(id);
  res.json(component);
};
