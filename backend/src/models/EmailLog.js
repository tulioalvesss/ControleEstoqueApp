const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// email log esta inativo


const EmailLog = sequelize.define('EmailLog', {
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
  enterpriseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Enterprises',
      key: 'id'
    }
  },
  lastSentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = EmailLog; 