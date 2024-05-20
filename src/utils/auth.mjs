import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
  const token = jwt.sign({ id: user.id, username: user.email }, process.env.JWT_SECRET);
  console.log(token, 'return form jwt');
  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
