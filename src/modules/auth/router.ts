import { Router } from 'express';
import AuthController from './AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/auth/login', authController.login);
authRouter.post('/auth/refresh', authController.getRefreshToken);
authRouter.post('/auth/logout', authController.logout);

export default authRouter;
