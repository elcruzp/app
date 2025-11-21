const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = auth.replace('Bearer ', '');
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
