const Sector = require('../models/Sector');
const Stock = require('../models/Stock');
const { sequelize } = require('../config/database');

exports.createSector = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { name, description } = req.body;
    const enterpriseId = req.user.enterpriseId;

    // Verifica se já existe um setor com o mesmo nome na empresa
    const existingSector = await Sector.findOne({
      where: { 
        name,
        enterpriseId
      }
    });

    if (existingSector) {
      await t.rollback();
      return res.status(400).json({ message: 'Já existe um setor com este nome' });
    }

    // Cria o setor
    const sector = await Sector.create({
      name,
      description,
      enterpriseId
    }, { transaction: t });

    // Cria automaticamente um Stock para o setor
    const stock = await Stock.create({
      name: `Estoque ${sector.name}`,
      sectorId: sector.id,
      enterpriseId
    }, { transaction: t });

    await t.commit();

    // Retorna o setor com o stock associado
    const sectorWithStock = await Sector.findByPk(sector.id, {
      include: [{
        model: Stock,
        include: ['components']
      }]
    });

    res.status(201).json(sectorWithStock);
  } catch (error) {
    await t.rollback();
    console.error('Erro ao criar setor:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

exports.getSectors = async (req, res) => {
  try {
    const sectors = await Sector.findAll({
      where: { enterpriseId: req.user.enterpriseId },
      include: [{
        model: Stock,
        as: 'stock',
        include: ['components']
      }]
    });
    
    res.status(200).json(sectors);
  } catch (error) {
    console.error('Erro ao buscar setores:', error);
    res.status(500).json({ message: 'Erro ao buscar setores', error: error.message });
  }
};

exports.updateSector = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const enterpriseId = req.user.enterpriseId;

    const sector = await Sector.findOne({
      where: { 
        id,
        enterpriseId
      }
    });

    if (!sector) {
      return res.status(404).json({ message: 'Setor não encontrado' });
    }

    // Verifica se já existe outro setor com o mesmo nome
    if (name && name !== sector.name) {
      const existingSector = await Sector.findOne({
        where: { 
          name,
          enterpriseId,
          id: { [Op.ne]: id } // Exclui o setor atual da busca
        }
      });

      if (existingSector) {
        return res.status(400).json({ message: 'Já existe um setor com este nome' });
      }
    }

    await sector.update({ name, description });
    res.status(200).json(sector);
  } catch (error) {
    console.error('Erro ao atualizar setor:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSector = async (req, res) => {
  try {
    const { id } = req.params;
    const enterpriseId = req.user.enterpriseId;

    // Verifica se existem itens em estoque neste setor
    const stockCount = await Stock.count({
      where: { 
        sectorId: id,
        enterpriseId
      }
    });

    if (stockCount > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir o setor pois existem itens em estoque vinculados a ele'
      });
    }

    const deleted = await Sector.destroy({
      where: { 
        id,
        enterpriseId
      }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Setor não encontrado' });
    }

    res.status(200).json({ message: 'Setor excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir setor:', error);
    res.status(500).json({ message: error.message });
  }
};