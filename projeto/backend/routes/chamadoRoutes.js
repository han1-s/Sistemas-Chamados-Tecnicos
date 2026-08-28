const express = require('express');
const router = express.Router();
const {
  listarChamados,
  resumoDashboard,
  buscarChamado,
  criarChamado,
  atualizarChamado,
  excluirChamado
} = require('../controllers/chamadoController');

// Precisa vir antes de '/:id' para não ser interpretado como um ID
router.get('/resumo/dashboard', resumoDashboard);

router.get('/', listarChamados);
router.get('/:id', buscarChamado);
router.post('/', criarChamado);
router.put('/:id', atualizarChamado);
router.delete('/:id', excluirChamado);

module.exports = router;
