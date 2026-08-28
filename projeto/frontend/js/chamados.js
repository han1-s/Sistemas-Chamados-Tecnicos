const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');

if (!usuarioLogado) {
  window.location.href = 'login.html';
}

document.getElementById('nome-usuario').textContent = usuarioLogado ? `Olá, ${usuarioLogado.nome}` : '';

document.getElementById('btn-sair').addEventListener('click', () => {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

async function carregarUsuarios() {
  const select = document.getElementById('usuario_id');
  try {
    const usuarios = await apiRequest('/usuarios');
    select.innerHTML = '<option value="">Selecione</option>' +
      usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
  } catch (erro) {
    alert('Erro ao carregar usuários: ' + erro.message);
  }
}

function linhaChamado(chamado) {
  const dataFormatada = new Date(chamado.data_criacao).toLocaleString('pt-BR');

  return `
    <tr data-id="${chamado.id}">
      <td>${chamado.id}</td>
      <td>${chamado.titulo}</td>
      <td>${chamado.categoria}</td>
      <td>
        <select class="select-prioridade">
          <option value="baixa" ${chamado.prioridade === 'baixa' ? 'selected' : ''}>Baixa</option>
          <option value="média" ${chamado.prioridade === 'média' ? 'selected' : ''}>Média</option>
          <option value="alta" ${chamado.prioridade === 'alta' ? 'selected' : ''}>Alta</option>
        </select>
      </td>
      <td>
        <select class="select-status">
          <option value="aberto" ${chamado.status === 'aberto' ? 'selected' : ''}>Aberto</option>
          <option value="em andamento" ${chamado.status === 'em andamento' ? 'selected' : ''}>Em andamento</option>
          <option value="concluído" ${chamado.status === 'concluído' ? 'selected' : ''}>Concluído</option>
        </select>
      </td>
      <td>${chamado.responsavel}</td>
      <td>${dataFormatada}</td>
      <td>
        <button class="btn-salvar">Salvar</button>
        <button class="btn-excluir">Excluir</button>
      </td>
    </tr>
  `;
}

async function carregarChamados() {
  const status = document.getElementById('filtro-status').value;
  const prioridade = document.getElementById('filtro-prioridade').value;

  const parametros = new URLSearchParams();
  if (status) parametros.append('status', status);
  if (prioridade) parametros.append('prioridade', prioridade);

  try {
    const chamados = await apiRequest(`/chamados?${parametros.toString()}`);
    const corpoTabela = document.querySelector('#tabela-chamados tbody');
    corpoTabela.innerHTML = chamados.map(linhaChamado).join('');
  } catch (erro) {
    alert('Erro ao carregar chamados: ' + erro.message);
  }
}

document.getElementById('filtro-status').addEventListener('change', carregarChamados);
document.getElementById('filtro-prioridade').addEventListener('change', carregarChamados);

document.getElementById('form-chamado').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const mensagemErro = document.getElementById('mensagem-erro-chamado');
  mensagemErro.textContent = '';

  const corpo = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    categoria: document.getElementById('categoria').value.trim(),
    prioridade: document.getElementById('prioridade').value,
    usuario_id: document.getElementById('usuario_id').value
  };

  if (!corpo.titulo || !corpo.descricao || !corpo.categoria || !corpo.prioridade || !corpo.usuario_id) {
    mensagemErro.textContent = 'Preencha todos os campos obrigatórios.';
    return;
  }

  try {
    await apiRequest('/chamados', {
      method: 'POST',
      body: JSON.stringify(corpo)
    });

    document.getElementById('form-chamado').reset();
    carregarChamados();
  } catch (erro) {
    mensagemErro.textContent = erro.message;
  }
});

document.querySelector('#tabela-chamados tbody').addEventListener('click', async (evento) => {
  const linha = evento.target.closest('tr');
  if (!linha) return;

  const id = linha.dataset.id;

  if (evento.target.classList.contains('btn-salvar')) {
    const prioridade = linha.querySelector('.select-prioridade').value;
    const status = linha.querySelector('.select-status').value;

    try {
      await apiRequest(`/chamados/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ prioridade, status })
      });
      alert('Chamado atualizado com sucesso.');
      carregarChamados();
    } catch (erro) {
      alert('Erro ao atualizar: ' + erro.message);
    }
  }

  if (evento.target.classList.contains('btn-excluir')) {
    const confirmar = confirm('Deseja realmente excluir este chamado?');
    if (!confirmar) return;

    try {
      await apiRequest(`/chamados/${id}`, { method: 'DELETE' });
      carregarChamados();
    } catch (erro) {
      alert('Erro ao excluir: ' + erro.message);
    }
  }
});

carregarUsuarios();
carregarChamados();
