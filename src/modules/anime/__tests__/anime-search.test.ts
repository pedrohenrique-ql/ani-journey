import createApp from '@/server/app';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createAuthenticatedUser } from '@tests/utils/auth';
import { createJikanAnimeResponse, createJikanAnimeSearchResponse, toAnimeListResponse } from '@tests/utils/anime';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';

describe('Anime (Search)', async () => {
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
});
