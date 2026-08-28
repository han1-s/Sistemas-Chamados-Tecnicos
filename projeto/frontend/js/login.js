document.getElementById('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const mensagemErro = document.getElementById('mensagem-erro');
  mensagemErro.textContent = '';

  if (!email || !senha) {
    mensagemErro.textContent = 'Preencha email e senha.';
    return;
  }

  try {
    const dados = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });

    localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    window.location.href = 'dashboard.html';
  } catch (erro) {
    mensagemErro.textContent = erro.message;
  }
});
