import { Router } from 'express';
import UserController from './UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/users', userController.create);
userRouter.get('/users/:id', userController.getById);
userRouter.patch('/users/:id', userController.update);
userRouter.delete('/users/:id', userController.delete);

export default userRouter;
