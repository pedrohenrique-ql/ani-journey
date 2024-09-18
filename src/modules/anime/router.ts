import { Router } from 'express';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';
import AnimeController from './AnimeController';

const animeRouter = Router();
const animeController = new AnimeController();

animeRouter.get('/anime', ensureAuthenticated, animeController.getAll);

export default animeRouter;
