import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import userRouter from './modules/users/router';
import errorHandler from './errors/errorHandler';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? '8080');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './main-page', 'index.html'));
});

app.use(userRouter);

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
