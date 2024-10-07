import { Express } from 'express';

import supertest from 'supertest';
import { expect } from 'vitest';
import { createUser } from './users';
import { User } from '@prisma/client';

export async function createAuthenticatedUser(app: Express, partialUser: Partial<User> = {}) {
  const userPassword = 'password';
  const { user: createdUser } = await createUser({ password: userPassword, ...partialUser });

  const loginResponse = await supertest(app).post('/auth/login').send({
    email: createdUser.email,
    password: userPassword,
  });
  expect(loginResponse.status).toBe(200);

  return { user: createdUser, auth: loginResponse.body, password: userPassword };
}
