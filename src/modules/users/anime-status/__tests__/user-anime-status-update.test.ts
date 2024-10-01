import createApp from '@/server/app';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { WatchStatus } from '@prisma/client';
import prisma from '@/database/prismaClient';
import { createId } from '@paralleldrive/cuid2';

describe('User Anime Status (Update)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

  beforeEach(async () => {
    await prisma.userAnimeStatus.deleteMany();
  });

  it('should create a new user anime status record if does not exists', async () => {
    let userAnimeStatus = await prisma.userAnimeStatus.findMany({
      where: {
        userId: user.id,
      },
    });
    expect(userAnimeStatus).toHaveLength(0);

    const animeId = 1;
    const status = WatchStatus.WATCHING;

    const updateUserAnimeStatusResponse = await supertest(app)
      .put(`/users/${user.id}/anime/${animeId}/status`)
      .send({ status })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(updateUserAnimeStatusResponse.status).toBe(200);
    expect(updateUserAnimeStatusResponse.body).toEqual({ userId: user.id, animeId, status });

    userAnimeStatus = await prisma.userAnimeStatus.findMany({
      where: {
        userId: user.id,
      },
    });
    expect(userAnimeStatus).toHaveLength(1);
    expect(userAnimeStatus[0]).toMatchObject({ userId: user.id, animeId, status });
  });

  it('should update an existing user anime status record', async () => {
    const animeId = 1;
    const updatedStatus = WatchStatus.COMPLETED;

    await prisma.userAnimeStatus.create({
      data: {
        id: createId(),
        userId: user.id,
        animeId,
        status: WatchStatus.WATCHING,
      },
    });

    const updateUserAnimeStatusResponse = await supertest(app)
      .put(`/users/${user.id}/anime/${animeId}/status`)
      .send({ status: updatedStatus })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(updateUserAnimeStatusResponse.status).toBe(200);
    expect(updateUserAnimeStatusResponse.body).toEqual({ userId: user.id, animeId, status: updatedStatus });

    const userAnimeStatus = await prisma.userAnimeStatus.findMany({
      where: {
        userId: user.id,
      },
    });
    expect(userAnimeStatus).toHaveLength(1);
    expect(userAnimeStatus[0]).toMatchObject({ userId: user.id, animeId, status: updatedStatus });
  });

  it('should return 404 when user is not found', async () => {
    const nonExistingUserId = createId();
    const animeId = 1;

    const getUserAnimeListResponse = await supertest(app)
      .put(`/users/${nonExistingUserId}/anime/${animeId}/status`)
      .send({ status: WatchStatus.WATCHING })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeListResponse.status).toBe(404);
    expect(getUserAnimeListResponse.body).toEqual({ message: `User ${nonExistingUserId} not found.` });

    const userAnimeStatus = await prisma.userAnimeStatus.findMany({
      where: {
        userId: nonExistingUserId,
      },
    });
    expect(userAnimeStatus).toHaveLength(0);
  });

  it('should return 401 when user is not authenticated', async () => {
    const animeId = 1;

    const updateUserAnimeStatusResponse = await supertest(app)
      .put(`/users/${user.id}/anime/${animeId}/status`)
      .send({ status: WatchStatus.WATCHING });

    expect(updateUserAnimeStatusResponse.status).toBe(401);
    expect(updateUserAnimeStatusResponse.body).toEqual({ message: 'Token not provided.' });
  });
});
