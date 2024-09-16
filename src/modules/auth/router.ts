import { Router } from 'express';
import AuthController from './AuthController';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/auth/login', authController.login);
authRouter.post('/auth/refresh', ensureAuthenticated, authController.refresh);
authRouter.post('/auth/logout', ensureAuthenticated, authController.logout);

export default authRouter;
