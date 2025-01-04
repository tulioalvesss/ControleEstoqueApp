const User = require('./User');
const Enterprise = require('./Enterprise');
const Product = require('./Product');
const StockHistory = require('./StockHistory');
const Supplier = require('./supplier');
const Sector = require('./Sector');
const Stock = require('./Stock');
const ProductComponent = require('./ProductComponent');
const StockComponent = require('./StockComponent');

// Associações User <-> Enterprise
User.belongsTo(Enterprise, { foreignKey: 'enterpriseId', as: 'enterprise' });
Enterprise.hasMany(User, { foreignKey: 'enterpriseId', as: 'users' });

// Associações Product <-> Enterprise
Product.belongsTo(Enterprise, { foreignKey: 'enterpriseId', as: 'enterprise' });
Enterprise.hasMany(Product, { foreignKey: 'enterpriseId', as: 'products' });

// Associação StockHistory <-> Product
StockHistory.belongsTo(Product, { foreignKey: 'productId'});
Product.hasMany(StockHistory, { foreignKey: 'productId'});

// Associações Supplier <-> Enterprise
Supplier.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(Supplier, { foreignKey: 'enterpriseId' });

// Associações Sector <-> Enterprise
Sector.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(Sector, { foreignKey: 'enterpriseId' });

// Associações Stock <-> Sector & Enterprise
Stock.belongsTo(Enterprise, { foreignKey: 'enterpriseId' });
Enterprise.hasMany(Stock, { foreignKey: 'enterpriseId' });

Stock.belongsTo(Sector, { 
  foreignKey: 'sectorId',
  onDelete: 'RESTRICT', // Impede a exclusão de um setor se houver itens em estoque
  onUpdate: 'CASCADE'
});
Sector.hasMany(Stock, { foreignKey: 'sectorId' });

// Associações Product <-> StockComponent (através de ProductComponent)
Product.belongsToMany(StockComponent, {
  through: ProductComponent,
  foreignKey: 'productId',
  otherKey: 'componentId',
  as: 'components'
});

StockComponent.belongsToMany(Product, {
  through: ProductComponent,
  foreignKey: 'componentId',
  otherKey: 'productId',
  as: 'products'
});

// Associações Sector <-> Stock
Sector.hasOne(Stock, { 
  foreignKey: 'sectorId',
  as: 'stock'
});
Stock.belongsTo(Sector, { 
  foreignKey: 'sectorId'
});

// Associações Stock <-> StockComponent
Stock.hasMany(StockComponent, { 
  foreignKey: 'stockId',
  as: 'components'
});
StockComponent.belongsTo(Stock, { 
  foreignKey: 'stockId'
});

module.exports = {
  User,
  Enterprise,
  Product,
  StockHistory,
  Supplier,
  Sector
}; 