const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enterprise = sequelize.define('Enterprise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome da empresa é obrigatório' }
    }
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'CNPJ é obrigatório' },
      len: { args: [14, 14], msg: 'CNPJ deve ter 14 dígitos' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  plan: {
    type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
    defaultValue: 'basic',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
    allowNull: false
  }
}, {
  timestamps: true
});

// Definir as associações
Enterprise.associate = (models) => {
  Enterprise.hasMany(models.User, {
    foreignKey: 'enterpriseId',
    as: 'users'
  });
  
  Enterprise.hasMany(models.Product, {
    foreignKey: 'enterpriseId',
    as: 'products'
  });

  Enterprise.hasMany(models.Supplier, {
    foreignKey: 'enterpriseId',
    as: 'suppliers'
  });

  Enterprise.hasMany(models.Category, {
    foreignKey: 'enterpriseId',
    as: 'categories'
  });
};

module.exports = Enterprise;