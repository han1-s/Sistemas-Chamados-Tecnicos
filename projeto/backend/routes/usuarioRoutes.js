const express = require('express');
const router = express.Router();
const { criarUsuario, listarUsuarios } = require('../controllers/usuarioController');

router.post('/', criarUsuario);
router.get('/', listarUsuarios);

module.exports = router;
