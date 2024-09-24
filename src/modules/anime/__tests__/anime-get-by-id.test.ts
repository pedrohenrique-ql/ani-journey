import createApp from '@/server/app';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createAuthenticatedUser } from '@tests/utils/auth';
import { createJikanAnimeResponse, toAnimeResponse } from '@tests/utils/anime';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

describe('Anime (Get by id)', async () => {
  const app = await createApp();

  beforeAll(async () => {
    await jikanInterceptor.start();
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

  // it('should return 404 when anime is not found', async () => {
  //   const animeId = 390480;

  //   const animeByIdHandler = jikanInterceptor.get(`/anime/${animeId}`).respond({
  //     status: 400,
  //   });

  //   const getAnimeByIdResponse = await supertest(app).get(`/anime/${animeId}`);
  //   expect(getAnimeByIdResponse.status).toBe(404);
  //   expect(getAnimeByIdResponse.body).toEqual({ message: `Anime ${animeId} not found.` });

  //   const requests = animeByIdHandler.requests();
  //   expect(requests).toHaveLength(1);
  // });

  it('should return 400 when anime id is invalid', async () => {
    const animeId = 'invalid-id';

    const getAnimeByIdResponse = await supertest(app).get(`/anime/${animeId}`);
    expect(getAnimeByIdResponse.status).toBe(400);
    expect(getAnimeByIdResponse.body).toEqual({ message: 'Validation error.' });
  });
});
