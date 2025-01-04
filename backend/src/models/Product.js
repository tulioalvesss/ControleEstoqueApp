const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sectorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sectors',
      key: 'id'
    }
  },
  enterpriseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Enterprises',
      key: 'id'
    }
  },
  isComposite: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'Products'
});

module.exports = Product; 