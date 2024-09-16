import { Router } from 'express';
import UserController from './UserController';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/users', userController.create);
userRouter.get('/users/:id', ensureAuthenticated, userController.getById);
userRouter.patch('/users/:id', ensureAuthenticated, userController.update);
userRouter.delete('/users/:id', ensureAuthenticated, userController.delete);

export default userRouter;
