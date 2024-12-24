const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Enterprise = require('./Enterprise');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  enterpriseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Enterprises',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

Category.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });

module.exports = Category;