const db = require('../config/db');

async function criarUsuario(req, res) {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ mensagem: 'Nome, email, senha e perfil são obrigatórios.' });
  }

  try {
    const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existente.length > 0) {
      return res.status(400).json({ mensagem: 'Já existe um usuário cadastrado com este email.' });
    }

    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senha, perfil]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: { id: resultado.insertId, nome, email, perfil }
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

async function listarUsuarios(req, res) {
  try {
    const [usuarios] = await db.query('SELECT id, nome, email, perfil FROM usuarios ORDER BY nome');
    return res.status(200).json(usuarios);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

module.exports = { criarUsuario, listarUsuarios };
