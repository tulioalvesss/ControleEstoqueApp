const Category = require('../models/Category');
const Enterprise = require('../models/Enterprise');

const categoryController = {
  // Método para listar todas as categorias
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Erro detalhado ao buscar categorias:', error);
      return res.status(500).json({ 
        message: 'Erro interno ao buscar categorias',
        error: error.message 
      });
    }
  },
  
  async getCategoryById(req, res){
    try {
      const category = await Category.findByPk(req.params.id);
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async createCategory(req, res){
    try {
      const { name, description, enterpriseId } = req.body;
      const enterprise = await Enterprise.findByPk(enterpriseId);
      if (!enterprise) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }
      const category = await Category.create({ name, description, enterpriseId });
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async updateCategory(req, res){
    try {
      const category = await Category.update(req.body, { where: { id: req.params.id } });
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async deleteCategory(req, res){
    try {
      await Category.destroy({ where: { id: req.params.id } });
      return res.status(204).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = categoryController;