const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const enterpriseRoutes = require('./routes/enterpriseRoutes');
const sectorRoutes = require('./routes/sectorRoutes');
const stockHistoryRoutes = require('./routes/stockHistoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
require('./models/associations');
const http = require('http');
const { Server } = require('socket.io');
const stockRoutes = require('./routes/stockRoutes');
const productComponentsRoutes = require('./routes/productComponentsRoutes');
const stockComponentRoutes = require('./routes/stockComponentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// Carrega variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware do Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  socket.on('setEnterprise', (enterpriseId) => {
    console.log(`Cliente associado à empresa ${enterpriseId}`);
    socket.join(`enterprise_${enterpriseId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Exponha o io para uso em outras partes da aplicação
app.set('io', io);

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/stock-history', stockHistoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/product-components', productComponentsRoutes);
app.use('/api/stock-components', stockComponentRoutes);
// Rota básica de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Controle de Estoque funcionando!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.put('/api/products/:id', async (req, res) => {
  try {
    // ... código de atualização do produto ...
    
    if (updatedProduct.quantity < 20) {
      const notification = await Notification.create({
        message: `Produto ${updatedProduct.name} está com estoque baixo (${updatedProduct.quantity} unidades)`,
        type: 'low_stock',
        ProductId: updatedProduct.id
      });
      
      io.emit('newNotification', notification);
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; 