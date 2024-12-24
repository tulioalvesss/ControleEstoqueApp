const Enterprise = require('../models/Enterprise');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.findAll();
    res.status(200).json(enterprises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

exports.getEnterprise = async (req, res) => {
  try {
    const enterprise = await Enterprise.findByPk(req.user.enterpriseId, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    if (!enterprise) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.json(enterprise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, cnpj, email, phone, address, city, state } = req.body;
    const userId = req.user.id;

    // Verificar se CNPJ já existe
    const existingEnterprise = await Enterprise.findOne({ where: { cnpj } });
    if (existingEnterprise) {
      return res.status(400).json({ message: 'CNPJ já cadastrado' });
    }

    // Criar empresa
    const enterprise = await Enterprise.create({
      name,
      cnpj,
      email,
      phone,
      address,
      city,
      state,
      status: 'active',
      plan: 'basic'
    });

    // Atualizar o usuário com o ID da empresa e torná-lo admin
    await User.update(
      { 
        enterpriseId: enterprise.id,
        role: 'admin'
      },
      { where: { id: userId } }
    );

    // Buscar usuário atualizado
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Enterprise,
        as: 'enterprise',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json({
      enterprise,
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const enterprise = await Enterprise.findByPk(id);
    if (!enterprise) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Verificar se o usuário pertence à empresa
    if (enterprise.id !== req.user.enterpriseId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await enterprise.update(updates);
    res.json(enterprise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const enterprise = await Enterprise.findByPk(id);
    
    if (!enterprise) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Verificar se o usuário pertence à empresa
    if (enterprise.id !== req.user.enterpriseId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(enterprise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEnterprise = async (req, res) => {
  try {
    const enterprise = await Enterprise.findByPk(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    await enterprise.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { email, role, name } = req.body;

    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Criar novo usuário se não existir
      user = await User.create({
        email,
        name,
        role: role || 'employee',
        enterpriseId: req.user.enterpriseId,
        // Gerar uma senha aleatória temporária
        password: Math.random().toString(36).slice(-8)
      });
    } else {
      if (user.enterpriseId) {
        return res.status(400).json({ message: 'Usuário já pertence a uma empresa' });
      }

      await user.update({
        enterpriseId: req.user.enterpriseId,
        role: role || 'employee'
      });
    }

    res.json({ message: 'Usuário adicionado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { 
        id: userId,
        enterpriseId: req.user.enterpriseId
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Não permitir remover o próprio usuário admin
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Não é possível remover seu próprio usuário' });
    }

    await user.update({
      enterpriseId: null,
      role: 'employee'
    });

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEnterpriseDetails = async (req, res) => {
  try {
    const enterprise = await Enterprise.findByPk(req.user.enterpriseId, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'sku', 'quantity', 'price', 'categoryId']
        }
      ]
    });

    if (!enterprise) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Formatar os dados para a resposta
    const response = {
      id: enterprise.id,
      name: enterprise.name,
      cnpj: enterprise.cnpj,
      email: enterprise.email,
      phone: enterprise.phone,
      address: enterprise.address,
      city: enterprise.city,
      state: enterprise.state,
      plan: enterprise.plan,
      status: enterprise.status,
      createdAt: enterprise.createdAt,
      statistics: {
        totalUsers: enterprise.users.length,
        totalProducts: enterprise.products.length,
        lowStockProducts: enterprise.products.filter(p => p.quantity <= p.minQuantity).length
      },
      users: enterprise.users,
      recentProducts: enterprise.products.slice(0, 5) // Últimos 5 produtos
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
