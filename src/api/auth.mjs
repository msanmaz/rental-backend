// src/api/auth.js
import { Router } from 'express';
import prisma from '../modules/db.mjs'
import { userSchema } from '../utils/validation.mjs'
import { serialize } from 'cookie';
import { verifyToken,comparePasswords,hashPassword,createJWT } from '../utils/auth.mjs';

const authRouter = Router()

// Create Admin
authRouter.post('/create-admin', async (req, res) => {
  const { email, password } = req.body;

  const { error } = userSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    return res.status(400).json({ error: 'Admin with this email already exists.' });
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
    res.json({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
authRouter.post('/login', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  const { email, password } = req.body;
  console.log(email, password);

  const user = await prisma.admin.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createJWT(user);

  const serializedCookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/', // Make cookie available for all routes
  });
  user.token = token
  res.setHeader('Set-Cookie', serializedCookie);
  res.json({ user });
});

// Verify Token
authRouter.get('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing from the authorization header' });
  }

  try {
    const user = verifyToken(token);
    console.log(user, 'verifyJWT');
    res.status(200).json({ user });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Logout
authRouter.get('/logout', (req, res) => {
  const serializedCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Set the cookie to expire immediately
    path: '/', // Ensure it matches the login cookie path
  });

  res.setHeader('Set-Cookie', serializedCookie);
  res.status(200).json({ message: 'Logout successful' });
});


export default authRouter;
