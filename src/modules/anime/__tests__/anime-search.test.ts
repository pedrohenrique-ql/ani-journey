import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { createId } from '@paralleldrive/cuid2';
import { Role } from '@prisma/client';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createJikanAnimeResponse, createJikanAnimeSearchResponse, toAnimeListResponse } from '@tests/utils/anime';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('Anime (Search)', async () => {
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

  it('should return a list of anime with pagination', async () => {
    const jikanAnimes = Array.from({ length: 5 }, () => createJikanAnimeResponse());
    const jikanAnimeSearchResponse = createJikanAnimeSearchResponse({ data: jikanAnimes });
    const { pagination } = jikanAnimeSearchResponse;

    const animeSearchHandler = jikanInterceptor
      .get('/anime')
      .with({ searchParams: { page: `${pagination!.items!.count!}`, limit: `${pagination!.items!.per_page!}` } })
      .respond({
        status: 200,
        body: jikanAnimeSearchResponse,
      });

    const searchAnimeResponse = await supertest(app).get('/anime').query({
      page: 1,
      pageSize: 5,
    });

    const expectedSearchAnimeResponse = toAnimeListResponse(jikanAnimeSearchResponse);
    expect(searchAnimeResponse.status).toBe(200);
    expect(searchAnimeResponse.body).toEqual(expectedSearchAnimeResponse);

    const requests = animeSearchHandler.requests();
    expect(requests).toHaveLength(1);
  });

  it('should search anime by title', async () => {
    const jikanAnimes = Array.from({ length: 5 }, () => createJikanAnimeResponse());
    const jikanAnimeSearchResponse = createJikanAnimeSearchResponse({ data: jikanAnimes });
    const { pagination } = jikanAnimeSearchResponse;

    const animeSearchHandler = jikanInterceptor
      .get('/anime')
      .with({
        searchParams: {
          page: `${pagination!.items!.count!}`,
          limit: `${pagination!.items!.per_page!}`,
          q: 'Attack on Titan',
        },
      })
      .respond({
        status: 200,
        body: jikanAnimeSearchResponse,
      });

    const searchAnimeResponse = await supertest(app).get('/anime').query({
      page: 1,
      pageSize: 5,
      title: 'Attack on Titan',
    });

    const expectedSearchAnimeResponse = toAnimeListResponse(jikanAnimeSearchResponse);
    expect(searchAnimeResponse.status).toBe(200);
    expect(searchAnimeResponse.body).toEqual(expectedSearchAnimeResponse);

    const requests = animeSearchHandler.requests();
    expect(requests).toHaveLength(1);
  });

  it('should return anime results with the average rating', async () => {
    const jikanAnime = createJikanAnimeResponse();
    const jikanAnimeSearchResponse = createJikanAnimeSearchResponse({ data: [jikanAnime] });

    const animeReviewsPayload = Array.from({ length: 3 }, (_, index) => ({
      id: createId(),
      rating: index + 1,
      text: 'Review',
      animeId: jikanAnime.mal_id!,
      userId: usersPayload[index].id,
    }));

    await prisma.animeReview.createMany({ data: animeReviewsPayload });

    const expectedRating =
      animeReviewsPayload.reduce((acc, review) => acc + review.rating, 0) / animeReviewsPayload.length;

    const animeSearchHandler = jikanInterceptor
      .get('/anime')
      .with({ searchParams: { page: '1', limit: '1' } })
      .respond({
        status: 200,
        body: jikanAnimeSearchResponse,
      });

    const searchAnimeResponse = await supertest(app).get('/anime').query({
      page: 1,
      pageSize: 1,
    });

    const expectedSearchAnimeResponse = toAnimeListResponse(jikanAnimeSearchResponse, [{ rating: expectedRating }]);
    expect(searchAnimeResponse.status).toBe(200);
    expect(searchAnimeResponse.body).toEqual(expectedSearchAnimeResponse);

    const requests = animeSearchHandler.requests();
    expect(requests).toHaveLength(1);
  });
});
