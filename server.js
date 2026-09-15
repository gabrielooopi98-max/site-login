const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ARQUIVO_USUARIOS = path.join(__dirname, 'usuarios.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function lerUsuarios() {
    if (!fs.existsSync(ARQUIVO_USUARIOS)) return [];
    const conteudo = fs.readFileSync(ARQUIVO_USUARIOS, 'utf-8');
    return conteudo ? JSON.parse(conteudo) : [];
}

function salvarUsuarios(usuarios) {
    fs.writeFileSync(ARQUIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
}

// Criar conta
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Preencha nome, email e senha.' });
    }

    const usuarios = lerUsuarios();

    const jaExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (jaExiste) {
        return res.status(409).json({ erro: 'Já existe uma conta com esse email.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    usuarios.push({ nome, email, senha: senhaCriptografada });
    salvarUsuarios(usuarios);

    res.status(201).json({ mensagem: 'Conta criada com sucesso! Faça login.' });
});

// Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Preencha email e senha.' });
    }

    const usuarios = lerUsuarios();
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!usuario) {
        return res.status(401).json({ erro: 'Email ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Email ou senha incorretos.' });
    }

    res.status(200).json({ mensagem: `Bem-vindo, ${usuario.nome}!` });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});