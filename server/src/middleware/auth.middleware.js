const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;
  const cookieToken = req.cookies ? req.cookies.token : null;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      }
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      }
    });
  }
};

module.exports = authMiddleware;
