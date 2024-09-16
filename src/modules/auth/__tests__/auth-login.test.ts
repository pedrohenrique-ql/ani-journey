import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { AccessTokenPayload, RefreshTokenPayload, verifyJWT } from '@/utils/auth';
import { createAuthenticatedUser } from '@tests/utils/auth';
import { createUser } from '@tests/utils/users';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Auth (Login)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should log in the user with email and password', async () => {
    const { user, password } = await createUser();

    const loginResponse = await supertest(app).post('/auth/login').send({
      email: user.email,
      password: password,
    });
    expect(loginResponse.status).toBe(200);

    expect(loginResponse.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const { accessToken, refreshToken } = loginResponse.body;
    expect(accessToken).not.toEqual(refreshToken);

    const userSession = await prisma.session.findMany({ where: { userId: user.id } });
    expect(userSession).toHaveLength(1);

    const accessTokenPayload = await verifyJWT<AccessTokenPayload>(accessToken);
    expect(accessTokenPayload.userId).toBe(user.id);
    expect(accessTokenPayload.role).toBe(user.role);
    expect(accessTokenPayload.sessionId).toEqual(userSession[0].id);
    expect(accessTokenPayload.role).toEqual(user.role);

    const refreshTokenPayload = await verifyJWT<RefreshTokenPayload>(refreshToken);
    expect(refreshTokenPayload.sessionId).toEqual(userSession[0].id);
  });

  it('should return 401 if password is invalid', async () => {
    const { user } = await createAuthenticatedUser(app);

    const loginResponse = await supertest(app).post('/auth/login').send({
      email: user.email,
      password: 'invalid-password',
    });
    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body).toEqual({ message: 'Invalid credentials.' });
  });

  it('should return 401 if email is invalid', async () => {
    const { password } = await createAuthenticatedUser(app);

    const loginResponse = await supertest(app).post('/auth/login').send({
      email: 'invalid@email.com',
      password: password,
    });
    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body).toEqual({ message: 'Invalid credentials.' });
  });
});
