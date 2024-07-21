import express, { Request, Response } from 'express';
import path from 'path';
import UsersRepository from './database/users';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? '8080');

const app = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './main-page', 'index.html'));
});

app.post('/users', (req: Request, res: Response) => {
  const { username, email } = req.body;

  const existingUserEmail = UsersRepository.findByEmail(email);
  const existingUsername = UsersRepository.findByUsername(username);

  if (existingUserEmail) {
    return res.status(400).send('Email already in use');
  }

  if (existingUsername) {
    return res.status(400).send('Username already in use');
  }

  const createdUser = UsersRepository.createUser({ username, email });
  res.status(201).send(createdUser);
});

app.get('/users', (_req: Request, res: Response) => {
  res.status(200).send(UsersRepository.getUsers());
});

app.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const user = UsersRepository.findById(id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  res.status(200).send(user);
});

app.patch('/users/:id/username', (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email } = req.body;

  const user = UsersRepository.findById(id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const existingUsername = UsersRepository.findByUsername(username);
  if (existingUsername) {
    return res.status(400).send('Username already in use');
  }

  const updatedUser = UsersRepository.updateUsername(id, username);
  res.status(200).send(updatedUser);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const user = UsersRepository.findById(id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  UsersRepository.deleteUser(id);
  res.status(204).send('User deleted');
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
