const Product  = require('../models/Product');
const { sequelize } = require('../config/database');
const { createStockHistory } = require('./stockHistoryController');
const StockHistory = require('../models/StockHistory');
const Enterprise = require('../models/Enterprise');
const Sector = require('../models/Sector');
const Supplier = require('../models/supplier');
const EmailLog = require('../models/EmailLog');
const ProductComponent = require('../models/ProductComponent');
const Stock = require('../models/Stock');
const StockComponent = require('../models/StockComponent');


// Produto precisa ser composto por itens do estoque, ex: capirinha deve ter 5 uvas e 10 bananas descontar os itens do estoque diretamente
// Nova maneira de add itens ao estoque, deve ser possivel adicionar itens ao estoque, por exemplo uva e banana.
// quando um produto for consumido, deve ser possivel descontar os itens do estoque diretamente.

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { enterpriseId: req.user.enterpriseId },
      include: [{
        model: StockComponent,
        as: 'components',
        through: { attributes: ['quantity'] }
      }]
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
  const t = await sequelize.transaction();
  
  try {
    const { 
      name, 
      description, 
      price, 
      sku, 
      sectorId, 
      isComposite,
      components 
    } = req.body;
    
    const enterpriseId = req.user.enterpriseId;

    // Verifica se já existe um produto com o mesmo SKU na empresa
    const existingProduct = await Product.findOne({
      where: { 
        sku,
        enterpriseId
      }
    });

    if (existingProduct) {
      await t.rollback();
      return res.status(400).json({ message: 'Já existe um produto com este SKU' });
    }

    // Cria o produto
    const product = await Product.create({
      name,
      description,
      price,
      sku,
      sectorId,
      enterpriseId,
      isComposite
    }, { transaction: t });

    // Se for um produto composto, cria os componentes
    if (isComposite && components?.length > 0) {
      const productComponents = components.map(comp => ({
        productId: product.id,
        componentId: comp.componentId,
        quantity: comp.quantity
      }));

      await ProductComponent.bulkCreate(productComponents, { transaction: t });
    }

    await t.commit();

    // Retorna o produto com seus componentes
    const createdProduct = await Product.findByPk(product.id, {
      include: [{
        model: StockComponent,
        as: 'components',
        through: { attributes: ['quantity'] }
      }]
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    await t.rollback();
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

    // Verificar se precisa enviar email de alerta
    if (req.body.sendEmailAlert && product.quantity <= product.minQuantity) {
      await sendTestEmail(product);
    }

    // Resto do código de histórico permanece o mesmo
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
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ 
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

// Adicionar método para calcular quantidade disponível
exports.calculateAvailableQuantity = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [{
      model: Stock,
      as: 'components',
      through: { attributes: ['quantity'] }
    }]
  });

  if (!product.isComposite) return null;

  let maxQuantity = Infinity;
  
  for (const component of product.components) {
    const stockQuantity = component.quantity;
    const requiredQuantity = component.ProductComponent.quantity;
    const possibleQuantity = Math.floor(stockQuantity / requiredQuantity);
    maxQuantity = Math.min(maxQuantity, possibleQuantity);
  }

  return maxQuantity;
}; 