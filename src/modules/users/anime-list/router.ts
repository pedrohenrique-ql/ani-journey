import { Router } from 'express';
import UserAnimeListController from './UserAnimeListController';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';

const userAnimeListRouter = Router();
const userAnimeListController = new UserAnimeListController();

userAnimeListRouter.post('/users/:userId/anime-list', ensureAuthenticated, userAnimeListController.add);
userAnimeListRouter.get('/users/:userId/anime-list', ensureAuthenticated, userAnimeListController.getAll);
userAnimeListRouter.delete('/users/:userId/anime-list/:animeId', ensureAuthenticated, userAnimeListController.remove);

export default userAnimeListRouter;
