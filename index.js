// Importando os pacotes necessários
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config(); // Para carregar as variáveis do arquivo .env

// Configuração do App
const app = express();
app.use(cors());
app.use(express.json()); // Middleware para o Express entender JSON
const port = process.env.PORT || 3000;

// --- BANCO DE DADOS FALSO (PARA APRENDIZADO) ---
// Em um projeto real, isso viria de um banco como MongoDB, PostgreSQL, etc.
const users = [];

// --- ROTAS DE AUTENTICAÇÃO ---

// ROTA DE REGISTRO
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).send({ message: 'Usuário já cadastrado.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = {
      id: users.length + 1, // Simplesmente um ID incremental
      name,
      email,
      password: hashedPassword,
      refreshToken: null // <-- NOVO CAMPO! Começa como nulo.
    };
    users.push(newUser);
    console.log('Usuários no sistema:', users);

    res.status(201).send({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro no servidor.' });
  }
});

// ROTA DE LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send({ message: 'Email ou senha inválidos.' });
    }

    // --- A MÁGICA DO REFRESH TOKEN COMEÇA AQUI ---

    // 1. Criar o Access Token (curta duração)
    const accessToken = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '15s' } // Vida útil curta!
    );

    // 2. Criar o Refresh Token (longa duração)
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Vida útil longa!
    );

    // 3. Salvar o Refresh Token no "banco de dados" junto com o usuário
    user.refreshToken = refreshToken;

    // 4. Enviar AMBOS os tokens para o cliente
    res.json({
      message: "Login bem-sucedido!",
      accessToken: accessToken,
      refreshToken: refreshToken
    });

  } catch (error) {
    res.status(500).send({ message: 'Erro no servidor.' });
  }
});

// ROTA PARA GERAR UM NOVO ACCESS TOKEN (A "RECEPÇÃO")
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send({ message: 'Refresh token não fornecido.' });
  }

  // Verifica se o refresh token existe no nosso "banco de dados"
  const user = users.find(u => u.refreshToken === refreshToken);
  if (!user) {
    return res.status(403).send({ message: 'Refresh token inválido.' });
  }

  // Verifica a validade do refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Refresh token inválido ou expirado.' });
    }

    // Se tudo estiver ok, cria um NOVO access token
    const newAccessToken = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
});

// ROTA DE LOGOUT
app.post('/api/auth/logout', (req, res) => {
    const { refreshToken } = req.body;
    const user = users.find(u => u.refreshToken === refreshToken);
    if (user) {
        // Remove o refresh token do usuário, invalidando a sessão
        user.refreshToken = null;
    }
    res.send({ message: 'Logout realizado com sucesso.' });
});


// --- ROTAS PROTEGIDAS ---

// Importando e usando o seu middleware que já estava perfeito
const authenticateToken = require('./authMiddleware');

app.get('/api/auth/me', authenticateToken, (req, res) => {
  // Graças ao middleware, o req.user é adicionado na requisição
  res.send({
    message: 'Você tem acesso à área protegida!',
    user: req.user
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});