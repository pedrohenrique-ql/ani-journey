import 'express-async-errors';
import createApp from './server/app';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? '8080');

async function startServer() {
  const app = await createApp();

  return new Promise<void>((resolve) => {
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      resolve();
    });
  });
}

startServer();
