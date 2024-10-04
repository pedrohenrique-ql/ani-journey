import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createJikanAnimeResponse } from '@tests/utils/anime';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AnimeReviewResponse } from '../toResponse';

describe('Anime Review (Get by id)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

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

  it('should create an anime review', async () => {
    const jikanAnimeGetByIdResponse = createJikanAnimeResponse();

    const animeByIdHandler = jikanInterceptor.get(`/anime/${jikanAnimeGetByIdResponse.mal_id}`).respond({
      status: 200,
      body: { data: jikanAnimeGetByIdResponse },
    });

    const createAnimeReviewResponse = await supertest(app)
      .post(`/anime/${jikanAnimeGetByIdResponse.mal_id}/reviews`)
      .send({ rating: 5, text: 'Great anime!' })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(createAnimeReviewResponse.status).toBe(201);
    const animeReview = createAnimeReviewResponse.body as AnimeReviewResponse;

    expect(animeReview).toEqual({
      id: expect.any(String),
      rating: 5,
      text: 'Great anime!',
      animeId: jikanAnimeGetByIdResponse.mal_id,
      userId: user.id,
      createdAt: expect.any(String),
    });

    const requests = animeByIdHandler.requests();
    expect(requests).toHaveLength(1);

    const createdAnimeReview = await prisma.animeReview.findFirst({
      where: {
        animeId: jikanAnimeGetByIdResponse.mal_id,
        userId: user.id,
      },
    });
    expect(createdAnimeReview).not.toBeNull();
    expect(createdAnimeReview!.id).toEqual(animeReview.id);
  });

  it('should return 404 when anime is not found', async () => {
    const animeId = 390480;

    const animeByIdHandler = jikanInterceptor.get(`/anime/${animeId}`).respond({
      status: 400,
    });

    const createAnimeReviewResponse = await supertest(app)
      .post(`/anime/${animeId}/reviews`)
      .send({ rating: 5, text: 'Great anime!' })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(createAnimeReviewResponse.status).toBe(404);
    expect(createAnimeReviewResponse.body).toEqual({ message: `Anime ${animeId} not found.` });

    const requests = animeByIdHandler.requests();
    expect(requests).toHaveLength(1);
  });

  it('should return 400 when rating is invalid', async () => {
    const animeId = 1;

    let createAnimeReviewResponse = await supertest(app)
      .post(`/anime/${animeId}/reviews`)
      .send({ rating: 6, text: 'Great anime!' })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(createAnimeReviewResponse.status).toBe(400);
    expect(createAnimeReviewResponse.body).toEqual({ message: 'Validation error.' });

    createAnimeReviewResponse = await supertest(app)
      .post(`/anime/${animeId}/reviews`)
      .send({ rating: 0, text: 'Great anime!' })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(createAnimeReviewResponse.status).toBe(400);
    expect(createAnimeReviewResponse.body).toEqual({ message: 'Validation error.' });
  });
});
