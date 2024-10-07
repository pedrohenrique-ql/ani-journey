import { Router } from 'express';
import StatisticController from './StatisticController';
import ensureAuthenticated from '@/middlewares/ensureAuthenticated';
import ensureAuthorizedRole from '@/middlewares/ensureAuthorizedRole';

const statisticRouter = Router();
const statisticController = new StatisticController();

statisticRouter.get('/statistics', ensureAuthenticated, ensureAuthorizedRole('ADMIN'), statisticController.get);

export default statisticRouter;
