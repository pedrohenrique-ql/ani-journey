import createApp from '@/server/app';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createJikanAnimeResponse, toAnimeResponse } from '@tests/utils/anime';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';
import { createId } from '@paralleldrive/cuid2';

describe('User Anime List (Get)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

  beforeAll(async () => {
    await jikanInterceptor.start();
  });

  beforeEach(async () => {
    await prisma.userAnimeList.deleteMany();
  });

  afterEach(() => {
    jikanInterceptor.clear();
  });

  afterAll(async () => {
    await jikanInterceptor.stop();
  });

  it('should return user anime list with pagination', async () => {
    const userAnimeList = await prisma.userAnimeList.createMany({
      data: Array.from({ length: 2 }, (_, index) => {
        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() + index);

        return {
          id: createId(),
          animeId: index + 1,
          userId: user.id,
          createdAt: createdAt,
        };
      }),
    });

    const animeIds = Array.from({ length: userAnimeList.count }, (_, index) => index + 1);

    const jikanAnimeGetByIdResponses = animeIds.map((id) => createJikanAnimeResponse({ mal_id: id }));
    const animeByIdHandlers = jikanAnimeGetByIdResponses.map((response) => {
      return jikanInterceptor.get(`/anime/${response.mal_id}`).respond({
        status: 200,
        body: { data: response },
      });
    });

    let getUserAnimeListResponse = await supertest(app)
      .get(`/users/${user.id}/anime-list`)
      .query({ page: 1, pageSize: 1 })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeListResponse.status).toBe(200);
    expect(getUserAnimeListResponse.body).toEqual({
      userId: user.id,
      data: [toAnimeResponse(jikanAnimeGetByIdResponses[1])],
      total: 2,
      page: 1,
    });

    expect(animeByIdHandlers[0].requests()).toHaveLength(0);
    expect(animeByIdHandlers[1].requests()).toHaveLength(1);

    getUserAnimeListResponse = await supertest(app)
      .get(`/users/${user.id}/anime-list`)
      .query({ page: 2, pageSize: 1 })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeListResponse.status).toBe(200);
    expect(getUserAnimeListResponse.body).toEqual({
      userId: user.id,
      data: [toAnimeResponse(jikanAnimeGetByIdResponses[0])],
      total: 2,
      page: 2,
    });

    expect(animeByIdHandlers[0].requests()).toHaveLength(1);
    expect(animeByIdHandlers[1].requests()).toHaveLength(1);

    getUserAnimeListResponse = await supertest(app)
      .get(`/users/${user.id}/anime-list`)
      .query({ page: 3, pageSize: 1 })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeListResponse.status).toBe(200);
    expect(getUserAnimeListResponse.body).toEqual({
      userId: user.id,
      data: [],
      total: 2,
      page: 3,
    });

    expect(animeByIdHandlers[0].requests()).toHaveLength(1);
    expect(animeByIdHandlers[1].requests()).toHaveLength(1);
  });

  it('should return 404 when user is not found', async () => {
    const nonExistingUserId = createId();
    const getUserAnimeListResponse = await supertest(app)
      .get(`/users/${nonExistingUserId}/anime-list`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(getUserAnimeListResponse.status).toBe(404);
    expect(getUserAnimeListResponse.body).toEqual({ message: `User ${nonExistingUserId} not found.` });
  });
});
