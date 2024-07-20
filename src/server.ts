import express, { Request, Response } from 'express';
import path from 'path';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? '8080');

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './main-page', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
