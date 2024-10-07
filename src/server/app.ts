import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import userRouter from '@/modules/users/router';
import authRouter from '@/modules/auth/router';
import errorHandler from '@/errors/errorHandler';
import animeRouter from '@/modules/anime/router';
import userAnimeListRouter from '@/modules/users/anime-list/router';
import userAnimeStatusRouter from '@/modules/users/anime-status/router';
import animeReviewRouter from '@/modules/anime/reviews/router';
import statisticRouter from '@/modules/statistics/router';

async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: '*' }));

  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './main-page', 'index.html'));
  });

  app.use(userRouter);
  app.use(authRouter);
  app.use(animeRouter);
  app.use(userAnimeListRouter);
  app.use(userAnimeStatusRouter);
  app.use(animeReviewRouter);
  app.use(statisticRouter);

  app.use(errorHandler);

  return app;
}

export default createApp;
