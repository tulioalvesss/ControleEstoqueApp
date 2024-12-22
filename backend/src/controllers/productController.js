const Product  = require('../models/Product');
const { sequelize } = require('../config/database');
const { createStockHistory } = require('./stockHistoryController');
const StockHistory = require('../models/StockHistory');
const notificationController = require('./notificationController');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { enterpriseId: req.user.enterpriseId }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      enterpriseId: req.user.enterpriseId,
      minQuantity: 20
    };
    
    const product = await Product.create(productData);

    // Registra a entrada inicial no histórico
    await createStockHistory(
      product.id,
      req.user.enterpriseId,
      0, // quantidade anterior
      product.quantity, // quantidade inicial
      'entrada',
      'Cadastro inicial do produto',
      req.user.name,
      null,
      product.name
    );

    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const previousQuantity = product.quantity;
    const previousName = product.name;
    const previousDescription = product.description;
    const previousValue = product.price;

    await product.update(req.body);


    //se o nome do produto foi alterado, registra no histórico
    if (req.body.name !== previousName) {
      await createStockHistory(
        product.id,
        req.user.enterpriseId,
        previousQuantity,
        req.body.quantity,
        'ajusteName',
        'Atualização do nome do produto. Nome anterior: ' + previousName + ' - Nome novo: ' + req.body.name,
        req.user.name,
        null,
        product.name
      );
    }
    if (req.body.description !== previousDescription) {
      await createStockHistory(
        product.id,
        req.user.enterpriseId,
        previousQuantity,
        req.body.quantity,
          'ajusteDescription',
          'Atualização da descrição do produto. Descrição anterior: ' + previousDescription + ' - Descrição novo: ' + req.body.description,
        req.user.name,
        null,
        product.name
      );
    }

    // Se a quantidade foi alterada, registra no histórico
    if (req.body.quantity !== undefined && previousQuantity !== req.body.quantity) {
      const changeType = req.body.quantity > previousQuantity ? 'entrada' : 'saida';
      await createStockHistory(
        product.id,
        req.user.enterpriseId,
        previousQuantity,
        req.body.quantity,
        changeType,
        'Atualização na quantidade do produto. Quantidade anterior: ' + previousQuantity + ' - Quantidade novo: ' + req.body.quantity,
        req.user.name,
        null,
        product.name
      );
    }

    // se o valor do produto foi alterado, registra no histórico
    if (req.body.price !== undefined && previousValue !== req.body.price) {
      await createStockHistory(
        product.id,
        req.user.enterpriseId,
        previousQuantity,
        req.body.quantity,
        'ajusteValue',
        'Atualização do valor do produto. Valor anterior: ' + previousValue + ' - Valor novo: ' + req.body.price,
        req.user.name,
        null,
        product.name
      );
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        enterpriseId: req.user.enterpriseId 
      },
      transaction: t
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Atualiza o histórico existente para preservar o nome do produto
    await StockHistory.update(
      { productName: product.name },
      { 
        where: { productId: product.id },
        transaction: t 
      }
    );

    // Registra a baixa final do estoque
    if (product.quantity > 0) {
      await createStockHistory(
        product.id,
        req.user.enterpriseId,
        product.quantity,
        0,
        'exclusao',
        'Produto removido do sistema',
        req.user.name,
        t,
        product.name
      );
    }
    
    // Agora podemos excluir o produto
    await product.destroy({ transaction: t });
    
    await t.commit();
    res.status(200).json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    await t.rollback();
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ 
      message: 'Erro ao excluir produto',
      error: error.message 
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, changeType, description } = req.body;
    
    const product = await Product.findOne({
      where: { 
        id,
        enterpriseId: req.user.enterpriseId 
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const previousQuantity = product.quantity;
    let newQuantity;

    switch (changeType) {
      case 'entrada':
        newQuantity = previousQuantity + quantity;
        break;
      case 'saída':
        if (previousQuantity < quantity) {
          return res.status(400).json({ message: 'Quantidade insuficiente em estoque' });
        }
        newQuantity = previousQuantity - quantity;
        break;
      case 'ajuste':
        newQuantity = quantity;
        break;
      default:
        return res.status(400).json({ message: 'Tipo de alteração inválido' });
    }

    // Atualiza o estoque do produto
    await product.update({ quantity: newQuantity });

    // Registra no histórico
    await createStockHistory(
      product.id,
      req.user.enterpriseId,
      previousQuantity,
      newQuantity,
      changeType,
      description,
      req.user.name,
      null,
      product.name
    );

    res.json({ 
      message: 'Estoque atualizado com sucesso',
      previousQuantity,
      newQuantity,
      changeType
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 