import { Router } from 'express';
import { createAdmin, login, verifyTokenHandler, logout } from '../handlers/authHandlers.mjs';

const authRouter = Router();

authRouter.post('/create-admin', createAdmin);
authRouter.post('/login', login);
authRouter.get('/verify-token', verifyTokenHandler);
authRouter.get('/logout', logout);

export default authRouter;