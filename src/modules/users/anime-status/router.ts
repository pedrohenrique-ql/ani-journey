import { Router } from 'express';
import UserAnimeStatusController from './UserAnimeStatusController';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';

const userAnimeStatusRouter = Router();
const userAnimeStatusController = new UserAnimeStatusController();

userAnimeStatusRouter.put(
  '/users/:userId/anime/:animeId/status',
  ensureAuthenticated,
  userAnimeStatusController.update,
);

userAnimeStatusRouter.get('/users/:userId/anime/:animeId/status', ensureAuthenticated, userAnimeStatusController.get);

export default userAnimeStatusRouter;
