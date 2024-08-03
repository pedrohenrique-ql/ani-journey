import { Router } from 'express';
import UserController from './UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/users', userController.findById);

export default userRouter;