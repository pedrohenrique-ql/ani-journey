import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { AccessTokenPayload, RefreshTokenPayload, verifyJWT } from '@/utils/auth';
import { createAuthenticatedUser } from '@tests/utils/auth';
import { createUser } from '@tests/utils/users';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Auth (Logout)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should log out the user', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const logoutResponse = await supertest(app).post('/auth/logout').auth(auth.accessToken, { type: 'bearer' }).send();
    expect(logoutResponse.status).toBe(204);

    const userSession = await prisma.session.findMany({ where: { userId: user.id } });
    expect(userSession).toHaveLength(0);
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await supertest(app).post('/auth/logout').send();
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token not provided.' });
  });
});
