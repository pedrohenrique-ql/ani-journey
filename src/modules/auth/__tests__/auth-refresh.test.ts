import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { AccessTokenPayload, verifyJWT } from '@/utils/auth';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Auth (Refresh)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should refresh the user's access token by passing the refresh token", async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const refreshResponse = await supertest(app)
      .post('/auth/refresh')
      .auth(auth.accessToken, { type: 'bearer' })
      .send({ refreshToken: auth.refreshToken });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toEqual({
      accessToken: expect.any(String),
    });

    const { accessToken } = refreshResponse.body;
    expect(accessToken).not.toBe(auth.accessToken);

    const oldAccessTokenPayload = await verifyJWT<AccessTokenPayload>(auth.accessToken);
    const newAccessTokenPayload = await verifyJWT<AccessTokenPayload>(accessToken);

    expect(newAccessTokenPayload.userId).toBe(oldAccessTokenPayload.userId);
    expect(newAccessTokenPayload.sessionId).toBe(oldAccessTokenPayload.sessionId);

    const userSessions = await prisma.session.findMany({ where: { userId: user.id } });
    expect(userSessions).toHaveLength(1);
    expect(userSessions[0].id).toBe(newAccessTokenPayload.sessionId);
  });

  it('should return 401 if the session doest not exists', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const logoutResponse = await supertest(app).post('/auth/logout').auth(auth.accessToken, { type: 'bearer' }).send();
    expect(logoutResponse.status).toBe(204);

    const userSession = await prisma.session.findMany({ where: { userId: user.id } });
    expect(userSession).toHaveLength(0);

    const refreshResponse = await supertest(app)
      .post('/auth/refresh')
      .auth(auth.accessToken, { type: 'bearer' })
      .send({ refreshToken: auth.refreshToken });

    expect(refreshResponse.status).toBe(401);
    expect(refreshResponse.body).toEqual({ message: 'Invalid credentials.' });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await supertest(app).post('/auth/refresh').send();
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token not provided.' });
  });
});
