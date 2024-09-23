import { Router } from 'express';
import AnimeController from './AnimeController';

const animeRouter = Router();
const animeController = new AnimeController();

animeRouter.get('/anime', animeController.getAll);
animeRouter.get('/anime/:id', animeController.getById);

export default animeRouter;
