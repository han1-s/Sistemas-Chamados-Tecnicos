const API_URL = 'http://localhost:3000';

async function apiRequest(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro na requisição.');
  }

  return dados;
}
