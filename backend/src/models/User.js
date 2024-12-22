const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome é obrigatório' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Email inválido' },
      notEmpty: { msg: 'Email é obrigatório' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Senha é obrigatória' }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'employee'),
    defaultValue: 'employee',
    allowNull: false
  },
  enterpriseId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    afterSync: async () => {
      try {
        const adminExists = await User.findOne({ where: { email: 'admin@admin.com' } });
        if (!adminExists) {
          await User.create({
            name: 'Administrador',
            email: 'admin@admin.com',
            password: 'admin',
            role: 'admin'
          });
          console.log('Usuário admin criado com sucesso');
        }
      } catch (error) {
        console.error('Erro ao criar usuário admin:', error);
      }
    }
  }
});

// Método para verificar senha
User.prototype.checkPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;