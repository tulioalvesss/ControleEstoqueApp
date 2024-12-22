const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StockHistory = sequelize.define('StockHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Products',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enterpriseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  previousQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  newQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  changeType: {
    type: DataTypes.ENUM('entrada', 'saida', 'ajusteName', 'ajusteDescription', 'ajusteQtd', 'exclusao'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = StockHistory;
