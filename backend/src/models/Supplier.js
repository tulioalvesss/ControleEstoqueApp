const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./Category');
const Enterprise = require('./Enterprise');


const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
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
    allowNull: false
  },
  categoryId:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enterpriseId:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Supplier.belongsTo(Category, { foreignKey: 'categoryId' });
Supplier.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });

module.exports = Supplier;