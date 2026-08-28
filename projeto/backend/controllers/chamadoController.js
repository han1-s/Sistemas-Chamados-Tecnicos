const db = require('../config/db');

const PRIORIDADES_VALIDAS = ['baixa', 'média', 'alta'];
const STATUS_VALIDOS = ['aberto', 'em andamento', 'concluído'];

async function listarChamados(req, res) {
  const { status, prioridade } = req.query;

  let sql = `
    SELECT c.id, c.titulo, c.descricao, c.prioridade, c.status, c.categoria,
           c.usuario_id, u.nome AS responsavel, c.data_criacao
    FROM chamados c
    JOIN usuarios u ON u.id = c.usuario_id
    WHERE 1 = 1
  `;
  const parametros = [];

  if (status) {
    sql += ' AND c.status = ?';
    parametros.push(status);
  }

  if (prioridade) {
    sql += ' AND c.prioridade = ?';
    parametros.push(prioridade);
  }

  sql += ' ORDER BY c.data_criacao DESC';

  try {
    const [chamados] = await db.query(sql, parametros);
    return res.status(200).json(chamados);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

async function resumoDashboard(req, res) {
  try {
    const [linhas] = await db.query(`
      SELECT
        SUM(status = 'aberto') AS abertos,
        SUM(status = 'em andamento') AS emAndamento,
        SUM(status = 'concluído') AS concluidos,
        COUNT(*) AS total
      FROM chamados
    `);

    const resumo = linhas[0];
    return res.status(200).json({
      abertos: Number(resumo.abertos) || 0,
      emAndamento: Number(resumo.emAndamento) || 0,
      concluidos: Number(resumo.concluidos) || 0,
      total: Number(resumo.total) || 0
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

async function buscarChamado(req, res) {
  const { id } = req.params;

  try {
    const [chamados] = await db.query(
      `SELECT c.id, c.titulo, c.descricao, c.prioridade, c.status, c.categoria,
              c.usuario_id, u.nome AS responsavel, c.data_criacao
       FROM chamados c
       JOIN usuarios u ON u.id = c.usuario_id
       WHERE c.id = ?`,
      [id]
    );

    if (chamados.length === 0) {
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    return res.status(200).json(chamados[0]);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

async function criarChamado(req, res) {
  const { titulo, descricao, categoria, prioridade, usuario_id } = req.body;

  if (!titulo || !descricao || !categoria || !prioridade || !usuario_id) {
    return res.status(400).json({
      mensagem: 'Título, descrição, categoria, prioridade e usuário responsável são obrigatórios.'
    });
  }

  if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ mensagem: 'Prioridade inválida. Use baixa, média ou alta.' });
  }

  try {
    const [usuarios] = await db.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário responsável não encontrado.' });
    }

    const [resultado] = await db.query(
      `INSERT INTO chamados (titulo, descricao, prioridade, status, categoria, usuario_id)
       VALUES (?, ?, ?, 'aberto', ?, ?)`,
      [titulo, descricao, prioridade, categoria, usuario_id]
    );

    return res.status(201).json({
      mensagem: 'Chamado cadastrado com sucesso.',
      chamado: { id: resultado.insertId, titulo, descricao, prioridade, status: 'aberto', categoria, usuario_id }
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

async function atualizarChamado(req, res) {
  const { id } = req.params;
  const { titulo, descricao, categoria, prioridade, status } = req.body;

  if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ mensagem: 'Prioridade inválida. Use baixa, média ou alta.' });
  }

  if (status && !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ mensagem: 'Status inválido. Use aberto, em andamento ou concluído.' });
  }

  try {
    const [existente] = await db.query('SELECT id FROM chamados WHERE id = ?', [id]);
    if (existente.length === 0) {
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    const campos = [];
    const valores = [];

    if (titulo) { campos.push('titulo = ?'); valores.push(titulo); }
    if (descricao) { campos.push('descricao = ?'); valores.push(descricao); }
    if (categoria) { campos.push('categoria = ?'); valores.push(categoria); }
    if (prioridade) { campos.push('prioridade = ?'); valores.push(prioridade); }
    if (status) { campos.push('status = ?'); valores.push(status); }

    if (campos.length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum dado válido para atualizar foi enviado.' });
    }

    valores.push(id);
    await db.query(`UPDATE chamados SET ${campos.join(', ')} WHERE id = ?`, valores);

    return res.status(200).json({ mensagem: 'Chamado atualizado com sucesso.' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

async function excluirChamado(req, res) {
  const { id } = req.params;

  try {
    const [existente] = await db.query('SELECT id FROM chamados WHERE id = ?', [id]);
    if (existente.length === 0) {
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    await db.query('DELETE FROM chamados WHERE id = ?', [id]);
    return res.status(200).json({ mensagem: 'Chamado excluído com sucesso.' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao acessar o banco de dados.' });
  }
}

module.exports = {
  listarChamados,
  resumoDashboard,
  buscarChamado,
  criarChamado,
  atualizarChamado,
  excluirChamado
};
