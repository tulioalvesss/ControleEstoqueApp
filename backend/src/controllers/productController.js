const Product  = require('../models/Product');
const { sequelize } = require('../config/database');
const { createStockHistory } = require('./stockHistoryController');
const StockHistory = require('../models/StockHistory');
const notificationController = require('./notificationController');
const Enterprise = require('../models/Enterprise');
const Category = require('../models/Category');
const Supplier = require('../models/supplier');
const EmailLog = require('../models/EmailLog');

// Constantes para controle de frequência
const MIN_MINUTES_BETWEEN_EMAILS = 6; // Mínimo de 6 minutos entre emails

const sendTestEmail = async (product) => {
  try {
    // Verificar último email enviado
    const lastEmail = await EmailLog.findOne({
      where: { 
        productId: product.id,
        enterpriseId: product.enterpriseId
      },
      order: [['lastSentAt', 'DESC']]
    });

    // Verificar se já passou o tempo mínimo desde o último email
    if (lastEmail) {
      const minutesSinceLastEmail = (new Date() - new Date(lastEmail.lastSentAt)) / (1000 * 60);
      
      if (minutesSinceLastEmail < MIN_MINUTES_BETWEEN_EMAILS) {
        console.log('----------------------------------------');
        console.log('[AVISO] Email não enviado:');
        console.log(`Último email enviado há ${Math.round(minutesSinceLastEmail)} minutos`);
        console.log(`Aguarde ${Math.round(MIN_MINUTES_BETWEEN_EMAILS - minutesSinceLastEmail)} minutos para enviar novamente`);
        console.log('----------------------------------------');
        return;
      }
    }

    // Buscar informações adicionais
    const enterprise = await Enterprise.findByPk(product.enterpriseId);
    const category = await Category.findByPk(product.categoryId);
    const supplier = await Supplier.findOne({
      where: { enterpriseId: product.enterpriseId }
    });

    // Verificações adicionais de segurança
    if (!enterprise?.email || !supplier?.email) {
      console.log('----------------------------------------');
      console.log('[ERRO] Email não enviado:');
      console.log('Faltam informações necessárias:');
      if (!enterprise?.email) console.log('- Email da empresa não cadastrado');
      if (!supplier?.email) console.log('- Email do fornecedor não cadastrado');
      console.log('----------------------------------------');
      return;
    }

    // Simular envio do email
    console.log('----------------------------------------');
    console.log('[EMAIL TESTE] Alerta de estoque baixo');
    console.log('----------------------------------------');
    console.log('Informações da Empresa:');
    console.log(`Nome: ${enterprise.name}`);
    console.log(`Email: ${enterprise.email}`);
    console.log('----------------------------------------');
    console.log('Informações do Fornecedor:');
    console.log(`Nome: ${supplier.name}`);
    console.log(`Email: ${supplier.email}`);
    console.log('----------------------------------------');
    console.log('Informações do Produto:');
    console.log(`Nome: ${product.name}`);
    console.log(`Categoria: ${category?.name || 'Não categorizado'}`);
    console.log(`Quantidade atual: ${product.quantity}`);
    console.log(`Quantidade mínima: ${product.minQuantity}`);
    console.log('----------------------------------------');

    // Registrar o envio do email
    await EmailLog.create({
      productId: product.id,
      enterpriseId: product.enterpriseId,
      lastSentAt: new Date()
    });

  } catch (error) {
    console.error('Erro ao enviar email de teste:', error);
  }
};

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
      minQuantity: req.body.minQuantity || 20
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