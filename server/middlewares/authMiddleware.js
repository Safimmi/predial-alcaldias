const jsonwebtoken = require('jsonwebtoken');

const API_KEY = process.env.API_KEY;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  jsonwebtoken.verify(token, API_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ error: 'Unauthorized' });

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
