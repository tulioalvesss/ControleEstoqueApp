const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InvalidToken = require('../models/InvalidToken');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Não autorizado, token não fornecido' });
    }

    try {
      // Verificar se o token está na lista negra
      const invalidToken = await InvalidToken.findOne({ where: { token } });
      if (invalidToken) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adicionar usuário ao request com suas relações
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            association: 'enterprise',
            attributes: ['id', 'name']
          }
        ]
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Adicionar token ao request para uso no logout
      req.token = token;

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token inválido' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Middleware para verificar roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Verificar se é uma rota de criação de empresa
      const isEnterpriseCreation = req.path === '/' && req.method === 'POST';

      // Se não for criação de empresa, verificar associação com empresa
      if (!isEnterpriseCreation) {
        if (!req.user.enterpriseId) {
          return res.status(403).json({ 
            message: 'Usuário não está associado a nenhuma empresa',
            code: 'NO_ENTERPRISE'
          });
        }
      } else {
        // Se for criação de empresa, verificar se usuário já tem empresa
        if (req.user.enterpriseId) {
          return res.status(403).json({ 
            message: 'Usuário já está associado a uma empresa',
            code: 'HAS_ENTERPRISE'
          });
        }
      }

      // Verificar role do usuário
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Usuário não tem permissão para acessar este recurso',
          code: 'INVALID_ROLE'
        });
      }

      next();
    } catch (error) {
      console.error('Erro no middleware de autorização:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}; 