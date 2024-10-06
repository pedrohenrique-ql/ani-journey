import { Router } from 'express';
import AnimeReviewController from './AnimeReviewController';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';

const animeReviewRouter = Router();
const animeReviewController = new AnimeReviewController();

animeReviewRouter.post('/anime/:animeId/reviews', ensureAuthenticated, animeReviewController.create);
animeReviewRouter.get('/anime/:animeId/reviews', animeReviewController.get);
animeReviewRouter.put('/anime/:animeId/reviews/:reviewId', ensureAuthenticated, animeReviewController.update);

export default animeReviewRouter;
