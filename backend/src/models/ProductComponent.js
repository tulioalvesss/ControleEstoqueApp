const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductComponent = sequelize.define('ProductComponent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  componentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'StockComponents',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'ProductComponents'
});

module.exports = ProductComponent; 