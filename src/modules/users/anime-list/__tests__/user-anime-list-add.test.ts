import createApp from '../../../../server/app';
import { jikanInterceptor } from '../../../../../tests/mocks/jikanInterceptor';
import { createJikanAnimeResponse } from '../../../../../tests/utils/anime';
import { createAuthenticatedUser } from '../../../../../tests/utils/auth';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import prisma from '../../../../database/prismaClient';
import { createId } from '@paralleldrive/cuid2';

describe('User Anime List (Add)', async () => {
  const app = await createApp();

  beforeAll(async () => {
    await jikanInterceptor.start();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterEach(() => {
    jikanInterceptor.clear();
  });

  afterAll(async () => {
    await jikanInterceptor.stop();
  });

  it('should add an anime in user list', async () => {
    const { auth, user } = await createAuthenticatedUser(app);

    const jikanAnimeGetByIdResponse = createJikanAnimeResponse();
    const animeByIdHandler = jikanInterceptor.get(`/anime/${jikanAnimeGetByIdResponse.mal_id}`).respond({
      status: 200,
      body: { data: jikanAnimeGetByIdResponse },
    });

    const addAnimeInUserListResponse = await supertest(app)
      .post(`/users/${user.id}/anime-list`)
      .send({ animeId: jikanAnimeGetByIdResponse.mal_id })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(addAnimeInUserListResponse.status).toBe(201);
    expect(addAnimeInUserListResponse.body).toEqual({
      message: `Anime ${jikanAnimeGetByIdResponse.mal_id} added to user list.`,
    });

    const requests = animeByIdHandler.requests();
    expect(requests).toHaveLength(1);
  });

  it('should return 404 when user is not found', async () => {
    const { auth } = await createAuthenticatedUser(app);

    const nonExistingUserId = createId();
    const addAnimeInUserListResponse = await supertest(app)
      .post(`/users/${nonExistingUserId}/anime-list`)
      .send({ animeId: 1 })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(addAnimeInUserListResponse.status).toBe(404);
    expect(addAnimeInUserListResponse.body).toEqual({ message: `User ${nonExistingUserId} not found.` });
  });

  it('should return 404 when anime is not found', async () => {});

  it('should return 400 when anime is already in user list', async () => {
    const { auth, user } = await createAuthenticatedUser(app);

    const animeId = 1;

    let addAnimeInUserListResponse = await supertest(app)
      .post(`/users/${user.id}/anime-list`)
      .send({ animeId: animeId })
      .auth(auth.accessToken, { type: 'bearer' });
    expect(addAnimeInUserListResponse.status).toBe(201);

    addAnimeInUserListResponse = await supertest(app)
      .post(`/users/${user.id}/anime-list`)
      .send({ animeId: animeId })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(addAnimeInUserListResponse.status).toBe(400);
    expect(addAnimeInUserListResponse.body).toEqual({
      message: `Anime ${animeId} is already in user list.`,
    });
  });
});
