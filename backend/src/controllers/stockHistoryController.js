const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');
const { Op } = require('sequelize');
const moment = require('moment');
const User = require('../models/User');

exports.getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !moment(date).isValid()) {
      return res.status(400).json({ message: 'Data inválida' });
    }

    const startDate = moment(date).startOf('day').toDate();
    const endDate = moment(date).endOf('day').toDate();

    // Busca todos os produtos da empresa
    const produtos = await Product.findAll({
      where: {
        enterpriseId: req.user.enterpriseId
      },
      attributes: ['id', 'name']
    });

    // Inicializa o mapa de movimentações por produto
    const movimentacoesPorProduto = new Map();
    produtos.forEach(produto => {
      movimentacoesPorProduto.set(produto.id, {
        id: produto.id,
        nome: produto.name,
        entradas: 0,
        saidas: 0,
        ajustes: 0,
        totalMovimentacoes: 0,
        movimentacoes: []
      });
    });

    // Busca movimentações do dia
    const stockChanges = await StockHistory.findAll({
      where: {
        enterpriseId: req.user.enterpriseId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Product,
        attributes: ['id', 'name'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });

    if (!stockChanges || stockChanges.length === 0) {
      return res.json({
        totalMovimentacoes: 0,
        produtosMaisMovimentados: [],
        movimentacoesPorProduto: []
      });
    }

    // Processa movimentações por produto
    stockChanges.forEach(movimento => {
      const produtoId = movimento.productId;
      const diferenca = Math.abs(movimento.newQuantity - movimento.previousQuantity);
      
      if (!movimentacoesPorProduto.has(produtoId)) {
        // Caso o produto tenha sido deletado, cria entrada com nome preservado
        movimentacoesPorProduto.set(produtoId, {
          id: produtoId,
          nome: movimento.productName,
          entradas: 0,
          saidas: 0,
          ajustes: 0,
          totalMovimentacoes: 0,
          movimentacoes: []
        });
      }

      const produtoStats = movimentacoesPorProduto.get(produtoId);
      
      switch(movimento.changeType) {
        case 'entrada':
          produtoStats.entradas += diferenca;
          break;
        case 'saida':
          produtoStats.saidas += diferenca;
          break;
        default:
          produtoStats.ajustes += diferenca;
      }

      produtoStats.totalMovimentacoes++;
      produtoStats.movimentacoes.push({
        tipo: movimento.changeType,
        quantidadeAnterior: movimento.previousQuantity,
        quantidadeNova: movimento.newQuantity,
        usuario: movimento.userName,
        data: movimento.createdAt,
        descricao: movimento.description
      });
    });

    // Prepara o resumo final
    const summary = {
      totalMovimentacoes: stockChanges.length,
      produtosMaisMovimentados: Array.from(movimentacoesPorProduto.values())
        .sort((a, b) => b.totalMovimentacoes - a.totalMovimentacoes)
        .slice(0, 5),
      movimentacoesPorProduto: Array.from(movimentacoesPorProduto.values())
        .filter(p => p.totalMovimentacoes > 0)
        .map(p => ({
          id: p.id,
          nome: p.nome,
          entradas: p.entradas,
          saidas: p.saidas,
          ajustes: p.ajustes,
          totalMovimentacoes: p.totalMovimentacoes,
          movimentacoes: p.movimentacoes
        }))
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Erro no relatório diário:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório diário', error: error.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Mês e ano são obrigatórios' });
    }

    const startDate = moment(`${year}-${month}-01`).startOf('month');
    const endDate = moment(startDate).endOf('month');

    // Busca todos os produtos da empresa
    const produtos = await Product.findAll({
      where: {
        enterpriseId: req.user.enterpriseId
      },
      attributes: ['id', 'name', 'sku']
    });

    // Inicializa o mapa de movimentações por produto
    const movimentacoesPorProduto = new Map();
    produtos.forEach(produto => {
      movimentacoesPorProduto.set(produto.id, {
        id: produto.id,
        nome: produto.name,
        sku: produto.sku,
        entradas: 0,
        saidas: 0,
        ajustes: 0,
        totalMovimentacoes: 0,
        movimentacoes: []
      });
    });

    // Busca movimentações do mês
    const stockChanges = await StockHistory.findAll({
      where: {
        enterpriseId: req.user.enterpriseId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'sku'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });

    if (!stockChanges || stockChanges.length === 0) {
      return res.json({
        totalMovimentacoes: 0,
        produtosMaisMovimentados: [],
        movimentacoesPorProduto: [],
        movimentacoesPorDia: {}
      });
    }

    // Processa movimentações por produto e por dia
    const movimentacoesPorDia = {};
    
    stockChanges.forEach(movimento => {
      const produtoId = movimento.productId;
      const diferenca = Math.abs(movimento.newQuantity - movimento.previousQuantity);
      const dia = moment(movimento.createdAt).format('YYYY-MM-DD');
      
      // Inicializa contadores do dia se não existirem
      movimentacoesPorDia[dia] = movimentacoesPorDia[dia] || {
        entradas: 0,
        saidas: 0
      };

      if (!movimentacoesPorProduto.has(produtoId)) {
        movimentacoesPorProduto.set(produtoId, {
          id: produtoId,
          nome: movimento.productName,
          sku: movimento.product?.sku,
          entradas: 0,
          saidas: 0,
          ajustes: 0,
          totalMovimentacoes: 0,
          movimentacoes: []
        });
      }

      const produtoStats = movimentacoesPorProduto.get(produtoId);
      
      switch(movimento.changeType) {
        case 'entrada':
          produtoStats.entradas += diferenca;
          movimentacoesPorDia[dia].entradas++;
          break;
        case 'saida':
          produtoStats.saidas += diferenca;
          movimentacoesPorDia[dia].saidas++;
          break;
        default:
          produtoStats.ajustes += diferenca;
      }

      produtoStats.totalMovimentacoes++;
      produtoStats.movimentacoes.push({
        tipo: movimento.changeType,
        quantidadeAnterior: movimento.previousQuantity,
        quantidadeNova: movimento.newQuantity,
        usuario: movimento.userName,
        data: movimento.createdAt,
        descricao: movimento.description
      });
    });

    // Prepara o resumo final
    const summary = {
      totalMovimentacoes: stockChanges.length,
      produtosMaisMovimentados: Array.from(movimentacoesPorProduto.values())
        .sort((a, b) => b.totalMovimentacoes - a.totalMovimentacoes)
        .slice(0, 5),
      movimentacoesPorProduto: Array.from(movimentacoesPorProduto.values())
        .filter(p => p.totalMovimentacoes > 0)
        .map(p => ({
          id: p.id,
          nome: p.nome,
          sku: p.sku,
          entradas: p.entradas,
          saidas: p.saidas,
          ajustes: p.ajustes,
          totalMovimentacoes: p.totalMovimentacoes,
          movimentacoes: p.movimentacoes
        })),
      movimentacoesPorDia
    };

    res.json(summary);
  } catch (error) {
    console.error('Erro no relatório mensal:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório mensal', error: error.message });
  }
};

exports.createStockHistory = async (
  productId, 
  enterpriseId, 
  previousQuantity, 
  newQuantity, 
  changeType,
  description, 
  userName,
  transaction = null,
  productName = null
) => {
  const stockHistoryData = {
    productId,
    enterpriseId,
    previousQuantity,
    newQuantity,
    changeType,
    description,
    userName,
    productName
  };

  console.log('Dados do histórico:', stockHistoryData);

  const options = transaction ? { transaction } : {};
  
  return await StockHistory.create(stockHistoryData, options);
};
