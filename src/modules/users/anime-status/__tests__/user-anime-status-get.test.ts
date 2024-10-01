import createApp from '@/server/app';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { WatchStatus } from '@prisma/client';
import prisma from '@/database/prismaClient';
import { createId } from '@paralleldrive/cuid2';

describe('User Anime Status (Get)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

  beforeEach(async () => {
    await prisma.userAnimeStatus.deleteMany();
  });

  it('should get user anime status by user id and anime id', async () => {
    const animeId = 1;

    await prisma.userAnimeStatus.create({
      data: {
        id: createId(),
        userId: user.id,
        animeId,
        status: WatchStatus.WATCHING,
      },
    });

    const getUserAnimeStatusResponse = await supertest(app)
      .get(`/users/${user.id}/anime/${animeId}/status`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeStatusResponse.status).toBe(200);
    expect(getUserAnimeStatusResponse.body).toMatchObject({ userId: user.id, animeId, status: WatchStatus.WATCHING });
  });

  it('should return 404 if user anime status does not exist', async () => {
    const animeId = 1;

    const getUserAnimeStatusResponse = await supertest(app)
      .get(`/users/${user.id}/anime/${animeId}/status`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeStatusResponse.status).toBe(404);
    expect(getUserAnimeStatusResponse.body).toEqual({
      message: `User anime status not found for user ${user.id} and anime ${animeId}.`,
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const animeId = 1;

    const getUserAnimeStatusResponse = await supertest(app).get(`/users/${user.id}/anime/${animeId}/status`);

    expect(getUserAnimeStatusResponse.status).toBe(401);
    expect(getUserAnimeStatusResponse.body).toEqual({ message: 'Token not provided.' });
  });
});
