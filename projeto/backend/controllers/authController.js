const db = require('../config/db');

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
  }

  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    const usuario = usuarios[0];

    // Comparação simples de senha em texto puro (mesmo formato usado no INSERT de teste).
    // Para um ambiente real, o ideal seria armazenar a senha com hash (ex: bcrypt).
    if (usuario.senha !== senha) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    return res.status(200).json({
      mensagem: 'Autenticado com sucesso.',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

module.exports = { login };
