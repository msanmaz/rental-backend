import prisma from '../modules/db.mjs';
import { userSchema } from '../utils/validation.mjs';
import { serialize } from 'cookie';
import { verifyToken, comparePasswords, hashPassword, createJWT } from '../utils/auth.mjs';

// Create Admin
export const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  const { error } = userSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    return res.status(400).json({ success: false, message: 'Admin with this email already exists.' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    const token = createJWT(user);
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Login
export const login = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: 'Request body is empty' });
  }

  const { email, password } = req.body;
  const user = await prisma.admin.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = createJWT(user);
  const serializedCookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/', // Make cookie available for all routes
  });
  res.setHeader('Set-Cookie', serializedCookie);
  res.json({ success: true, user, token });
};

// Verify Token
export const verifyTokenHandler = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is missing from the authorization header' });
  }

  try {
    const user = verifyToken(token);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout
export const logout = (req, res) => {
  const serializedCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Set the cookie to expire immediately
    path: '/', // Ensure it matches the login cookie path
  });

  res.setHeader('Set-Cookie', serializedCookie);
  res.status(200).json({ success: true, message: 'Logout successful' });
};