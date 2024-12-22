const User = require('./User');
const Enterprise = require('./Enterprise');
const Product = require('./Product');
const StockHistory = require('./StockHistory');
const Notification = require('./Notification');

// Associações User <-> Enterprise
User.belongsTo(Enterprise, { foreignKey: 'enterpriseId', as: 'enterprise' });
Enterprise.hasMany(User, { foreignKey: 'enterpriseId', as: 'users' });

// Associações Product <-> Enterprise
Product.belongsTo(Enterprise, { foreignKey: 'enterpriseId', as: 'enterprise' });
Enterprise.hasMany(Product, { foreignKey: 'enterpriseId', as: 'products' });

// Associação StockHistory <-> Product
StockHistory.belongsTo(Product, { foreignKey: 'productId'});
Product.hasMany(StockHistory, { foreignKey: 'productId'});

// Associações Notification
Enterprise.hasMany(Notification, { foreignKey: 'enterpriseId' });
Notification.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Product.hasMany(Notification, { foreignKey: 'productId' });
Notification.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  User,
  Enterprise,
  Product,
  StockHistory,
  Notification
}; 