const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  enterpriseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Notification;