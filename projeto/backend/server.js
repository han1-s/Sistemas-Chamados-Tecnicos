require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/chamados', chamadoRoutes);
app.use('/login', authRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sistema de Chamados Técnicos está no ar.' });
});

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
