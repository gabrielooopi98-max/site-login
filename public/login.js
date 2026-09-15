const container = document.getElementById('container');
const btnIrCadastro = document.getElementById('btn-ir-cadastro');
const btnIrLogin = document.getElementById('btn-ir-login');
const btnSwitchCadastro = document.querySelector('.btn-switch-cadastro');
const btnSwitchLogin = document.querySelector('.btn-switch-login');

const mostrarCadastro = () => container.classList.add('mostrar-cadastro');
const mostrarLogin = () => container.classList.remove('mostrar-cadastro');

if (btnIrCadastro) {
    btnIrCadastro.addEventListener('click', mostrarCadastro);
}

if (btnIrLogin) {
    btnIrLogin.addEventListener('click', mostrarLogin);
}

if (btnSwitchCadastro) {
    btnSwitchCadastro.addEventListener('click', mostrarCadastro);
}

if (btnSwitchLogin) {
    btnSwitchLogin.addEventListener('click', mostrarLogin);
}

// --- Criar conta ---
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const mensagem = document.getElementById('mensagem-cadastro');

    try {
        const resposta = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = dados.mensagem;
            mensagem.style.color = '#2E5443';
            document.getElementById('form-cadastro').reset();

            // depois de 1.2s, volta pro painel de login já com o overlay certo
            setTimeout(() => {
                container.classList.remove('mostrar-cadastro');
                mensagem.textContent = '';
            }, 1200);
        } else {
            mensagem.textContent = dados.erro;
            mensagem.style.color = '#B3261E';
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
        mensagem.style.color = '#B3261E';
    }
});

// --- Login ---
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    const mensagem = document.getElementById('mensagem-login');

    try {
        const resposta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = dados.mensagem;
            mensagem.style.color = '#2E5443';
            // aqui é onde você redirecionaria pra uma página interna, por exemplo:
            // window.location.href = '/dashboard.html';
        } else {
            mensagem.textContent = dados.erro;
            mensagem.style.color = '#B3261E';
        }
    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
        mensagem.style.color = '#B3261E';
    }
});