
import { verifyToken } from '../utils/auth.mjs';

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401).json({ message: 'No token found!' });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401).json({ message: 'Not a valid token!' });
    return;
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: e.message });
    } else {
      res.status(401).json({ message: 'Not a valid token' });
    }
  }
};
