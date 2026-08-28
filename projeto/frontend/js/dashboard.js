const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');

if (!usuarioLogado) {
  window.location.href = 'login.html';
}

document.getElementById('nome-usuario').textContent = usuarioLogado ? `Olá, ${usuarioLogado.nome}` : '';

document.getElementById('btn-sair').addEventListener('click', () => {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

async function carregarResumo() {
  try {
    const resumo = await apiRequest('/chamados/resumo/dashboard');
    document.getElementById('qtd-abertos').textContent = resumo.abertos;
    document.getElementById('qtd-andamento').textContent = resumo.emAndamento;
    document.getElementById('qtd-concluidos').textContent = resumo.concluidos;
    document.getElementById('qtd-total').textContent = resumo.total;
  } catch (erro) {
    alert('Erro ao carregar o dashboard: ' + erro.message);
  }
}

carregarResumo();
