const express = require('express');
const app = express();
const sectorRoutes = require('./routes/sectorRoutes');
const stockRoutes = require('./routes/stockRoutes');
const stockComponentRoutes = require('./routes/stockComponentRoutes');
const productComponentRoutes = require('./routes/productComponentRoutes');

// Rotas
app.use('/api/sectors', sectorRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/stock-components', stockComponentRoutes);
app.use('/api/product-components', productComponentRoutes);
