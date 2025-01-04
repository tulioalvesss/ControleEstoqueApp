const Supplier = require('../models/supplier');

// os suppliers são os fornecedores por empresa adicionar requisicao de enterpriseId FEITO

exports.getAll = async (req, res) => {
  const suppliers = await Supplier.findAll({ where: { enterpriseId: req.params.enterpriseId } });
  res.json(suppliers);
};

exports.create = async (req, res) => {
  const { name, email, phone, sectorId, enterpriseId } = req.body;
  const supplier = await Supplier.create({ name, email, phone, sectorId, enterpriseId });
  res.json(supplier);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, enterpriseId } = req.body;
  const supplier = await Supplier.update({ name, email, phone, enterpriseId }, { where: { id } });
  res.json(supplier);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Supplier.destroy({ where: { id } });
  res.json({ message: 'Fornecedor deletado com sucesso' });
};

