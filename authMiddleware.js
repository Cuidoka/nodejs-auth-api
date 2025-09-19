// authMiddleware.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Pegar o token do cabeçalho de autorização
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).send({ message: 'Acesso negado. Token não fornecido.' });
  }

  // Verificar o token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;