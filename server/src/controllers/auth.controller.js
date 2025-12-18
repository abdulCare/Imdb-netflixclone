const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');

const COOKIE_NAME = 'token';

const signToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production'
};

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  createdAt: user.createdAt
});

const register = async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({
      error: {
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      }
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  const token = signToken({ id: user._id, email: user.email });

  res
    .cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(201)
    .json({
      data: {
        user: sanitizeUser(user),
        token
      }
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      error: {
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({
      error: {
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }

  const token = signToken({ id: user._id, email: user.email });
  res
    .cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      data: {
        user: sanitizeUser(user),
        token
      }
    });
};

const logout = async (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions).json({ data: { success: true } });
};

const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }
    });
  }

  res.json({ data: { user: sanitizeUser(user) } });
};

module.exports = {
  register,
  login,
  logout,
  me
};
