import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/register', AuthController.register);
