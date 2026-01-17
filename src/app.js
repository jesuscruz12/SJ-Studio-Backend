const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// 🔌 Conectar MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API SJ Studio funcionando 🚀' });
});
const designRoutes = require('./routes/design.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);


module.exports = app;
