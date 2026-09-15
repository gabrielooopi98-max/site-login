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

const CHAVE_USUARIOS = 'site-login-usuarios';

function lerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || '[]');
    } catch (erro) {
        return [];
    }
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

async function gerarHash(valor) {
    const dados = new TextEncoder().encode(valor);
    const hash = await crypto.subtle.digest('SHA-256', dados);
    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

// --- Criar conta ---
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const mensagem = document.getElementById('mensagem-cadastro');

    const usuarios = lerUsuarios();
    const emailNormalizado = email.trim().toLowerCase();

    if (usuarios.some(usuario => usuario.email === emailNormalizado)) {
        mensagem.textContent = 'Já existe uma conta com esse email.';
        mensagem.style.color = '#B3261E';
        return;
    }

    usuarios.push({ nome: nome.trim(), email: emailNormalizado, senha: await gerarHash(senha) });
    salvarUsuarios(usuarios);
    mensagem.textContent = 'Conta criada com sucesso! Faça login.';
    mensagem.style.color = '#2E5443';
    document.getElementById('form-cadastro').reset();

    setTimeout(() => {
        container.classList.remove('mostrar-cadastro');
        mensagem.textContent = '';
    }, 1200);
});

// --- Login ---
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    const mensagem = document.getElementById('mensagem-login');

    const usuarios = lerUsuarios();
    const usuario = usuarios.find(item => item.email === email.trim().toLowerCase());
    const senhaCorreta = usuario && usuario.senha === await gerarHash(senha);

    if (senhaCorreta) {
        mensagem.textContent = `Bem-vindo, ${usuario.nome}!`;
        mensagem.style.color = '#2E5443';
    } else {
        mensagem.textContent = 'Email ou senha incorretos.';
        mensagem.style.color = '#B3261E';
    }
});