import express, { Request, Response } from 'express';
import path from 'path';
import userRouter from './modules/users/router';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? '8080');

const app = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './main-page', 'index.html'));
});

app.use(userRouter);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
