const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvalidToken = sequelize.define('InvalidToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

// Limpar tokens expirados periodicamente
setInterval(async () => {
  try {
    await InvalidToken.destroy({
      where: {
        expiresAt: { [sequelize.Op.lt]: new Date() }
      }
    });
  } catch (error) {
    console.error('Erro ao limpar tokens expirados:', error);
  }
}, 24 * 60 * 60 * 1000); // Executa uma vez por dia

module.exports = InvalidToken; 