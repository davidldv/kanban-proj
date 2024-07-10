import { Router, Request } from 'express';
import { UserController } from '../controller/user.controller.js';

export const userRouter = Router();


interface CustomRequest extends Request {
  session: {
      user: any;
  };
}

userRouter.use((req, res, next) => {
  UserController.checkSession(req as CustomRequest, res, next);
});

userRouter.get('/', (req, res) => UserController.getUserData(req as CustomRequest, res))
userRouter.post('/section', (req, res) => UserController.createSection(req as CustomRequest, res))
userRouter.delete('/section', (req, res) => UserController.deleteSection(req as CustomRequest, res))
userRouter.post('/card', (req, res) => UserController.createCard(req as CustomRequest, res))
userRouter.delete('/card', (req, res) => UserController.deleteCard(req as CustomRequest, res))
userRouter.patch('/account', (req, res) => UserController.updateAccount(req as CustomRequest, res))
userRouter.get('/account', (req, res) => UserController.getUserInfo(req as CustomRequest, res))