import express from 'express';
import path from 'path';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? '8080');

const server = express();

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
