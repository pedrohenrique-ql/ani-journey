import createApp from '@/server/app';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { createId } from '@paralleldrive/cuid2';

describe('Users (Get)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should get an user by id', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const getUserResponse = await supertest(app).get(`/users/${user.id}`).auth(auth.accessToken, { type: 'bearer' });
    expect(getUserResponse.status).toBe(200);

    expect(getUserResponse.body).toEqual({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  });

  it('should return 404 if user does not exist', async () => {
    const { auth } = await createAuthenticatedUser(app);
    const invalidUserId = createId();

    const getUserResponse = await supertest(app)
      .get(`/users/${invalidUserId}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserResponse.status).toBe(404);
    expect(getUserResponse.body).toEqual({ message: `User ${invalidUserId} not found.` });
  });

  it('should return 401 if user is not authenticated', async () => {
    const { user } = await createAuthenticatedUser(app);

    const getUserResponse = await supertest(app).get(`/users/${user.id}`);

    expect(getUserResponse.status).toBe(401);
    expect(getUserResponse.body).toEqual({ message: 'Token not provided.' });
  });
});
