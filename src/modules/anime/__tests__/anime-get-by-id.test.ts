import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { createId } from '@paralleldrive/cuid2';
import { Role } from '@prisma/client';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createJikanAnimeResponse, toAnimeResponse } from '@tests/utils/anime';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('Anime (Get by id)', async () => {
  const app = await createApp();

  const usersPayload = Array.from({ length: 3 }, (_, index) => ({
    id: createId(),
    username: `user-${index}`,
    email: `email${index}@email.com`,
    role: Role.NORMAL,
    password: 'password',
  }));

  await prisma.user.createMany({ data: usersPayload });

  beforeAll(async () => {
    await jikanInterceptor.start();
  });

  beforeEach(async () => {
    await prisma.animeReview.deleteMany();
  });

  afterEach(() => {
    jikanInterceptor.clear();
  });

  afterAll(async () => {
    await jikanInterceptor.stop();
  });

  it('should get an anime by id', async () => {
    const jikanAnimeGetByIdResponse = createJikanAnimeResponse();

    const animeByIdHandler = jikanInterceptor.get(`/anime/${jikanAnimeGetByIdResponse.mal_id}`).respond({
      status: 200,
      body: { data: jikanAnimeGetByIdResponse },
    });

    const getAnimeByIdResponse = await supertest(app).get(`/anime/${jikanAnimeGetByIdResponse.mal_id}`);

    const expectedGetAnimeByIdResponse = toAnimeResponse(jikanAnimeGetByIdResponse!);
    expect(getAnimeByIdResponse.status).toBe(200);
    expect(getAnimeByIdResponse.body).toEqual(expectedGetAnimeByIdResponse);

    const requests = animeByIdHandler.requests();
    expect(requests).toHaveLength(1);
  });

  it('should return 404 when anime is not found', async () => {
    const animeId = 390480;

    const animeByIdHandler = jikanInterceptor.get(`/anime/${animeId}`).respond({
      status: 400,
    });

    const getAnimeByIdResponse = await supertest(app).get(`/anime/${animeId}`);
    expect(getAnimeByIdResponse.status).toBe(404);
    expect(getAnimeByIdResponse.body).toEqual({ message: `Anime ${animeId} not found.` });

    const requests = animeByIdHandler.requests();
    expect(requests).toHaveLength(1);
  });

  it('should return 400 when anime id is invalid', async () => {
    const animeId = 'invalid-id';

    const getAnimeByIdResponse = await supertest(app).get(`/anime/${animeId}`);
    expect(getAnimeByIdResponse.status).toBe(400);
    expect(getAnimeByIdResponse.body).toEqual({ message: 'Validation error.' });
  });

  it.skip('should return the average rating', async () => {
    const jikanAnimeGetByIdResponse = createJikanAnimeResponse();

    const animeReviewsPayload = Array.from({ length: 3 }, (_, index) => ({
      id: createId(),
      rating: index + 1,
      text: 'Great anime!',
      animeId: jikanAnimeGetByIdResponse.mal_id!,
      userId: usersPayload[index].id,
      createdAt: new Date(),
    }));
    await prisma.animeReview.createMany({ data: animeReviewsPayload });

    const expectedRating =
      animeReviewsPayload.reduce((acc, review) => acc + review.rating, 0) / animeReviewsPayload.length;

    const animeByIdHandler = jikanInterceptor.get(`/anime/${jikanAnimeGetByIdResponse.mal_id}`).respond({
      status: 200,
      body: { data: jikanAnimeGetByIdResponse },
    });

    const getAnimeByIdResponse = await supertest(app).get(`/anime/${jikanAnimeGetByIdResponse.mal_id}`);
    const expectedGetAnimeByIdResponse = toAnimeResponse(jikanAnimeGetByIdResponse, { rating: expectedRating });

    expect(getAnimeByIdResponse.status).toBe(200);
    expect(getAnimeByIdResponse.body).toEqual(expectedGetAnimeByIdResponse);

    const requests = animeByIdHandler.requests();
    expect(requests).toHaveLength(1);
  });
});
