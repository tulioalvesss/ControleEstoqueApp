const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Enterprise = require('../models/Enterprise');
const InvalidToken = require('../models/InvalidToken');

// Gerar Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Registrar usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se usuário já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee'
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enterpriseId: user.enterpriseId,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enterpriseId: user.enterpriseId,
      hasEnterprise: !!user.enterpriseId,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Enterprise,
        as: 'enterprise',
        attributes: ['name']
      }]
    });
    res.json({
      ...user.toJSON(),
      hasEnterprise: !!user.enterpriseId
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Atualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, email, password } = req.body;
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enterpriseId: user.enterpriseId,
      hasEnterprise: !!user.enterpriseId
    });
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // Pegar o token do middleware de autenticação
    const token = req.token;
    
    // Decodificar o token para obter a data de expiração
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); // Converter de segundos para milissegundos

    // Adicionar o token à lista negra
    await InvalidToken.create({
      token,
      expiresAt
    });

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar usuário específico
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};