import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import { jikanInterceptor } from '@tests/mocks/jikanInterceptor';
import { createJikanAnimeResponse } from '@tests/utils/anime';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { AnimeReviewListResponse, AnimeReviewResponse, toAnimeReviewResponse } from '../toResponse';
import { createId } from '@paralleldrive/cuid2';
import { Role } from '@prisma/client';
import { toUserResponse } from '@/modules/users/toResponse';

describe('Anime Reviews (Get)', async () => {
  const app = await createApp();

  const usersPayload = Array.from({ length: 3 }, (_, index) => ({
    id: createId(),
    username: `user-${index}`,
    email: `email${index}@email.com`,
    role: Role.NORMAL,
    password: 'password',
  }));

  await prisma.user.createMany({ data: usersPayload });
  const users = await prisma.user.findMany({ where: { id: { in: usersPayload.map((user) => user.id) } } });

  beforeEach(async () => {
    await prisma.animeReview.deleteMany();
  });

  it('should get anime reviews with pagination', async () => {
    const animeId = 1;
    const now = new Date();

    const animeReviewsPayload = Array.from({ length: 2 }, (_, index) => ({
      id: createId(),
      rating: 5,
      text: 'Great anime!',
      animeId,
      userId: usersPayload[index].id,
      createdAt: new Date(now.getTime() + index),
    }));

    await prisma.animeReview.createMany({ data: animeReviewsPayload });

    let animeReviewsResponse = await supertest(app).get(`/anime/${animeId}/reviews`).query({ page: 1, pageSize: 1 });
    expect(animeReviewsResponse.status).toBe(200);

    let animeReviewsData = animeReviewsResponse.body as AnimeReviewListResponse;
    expect(animeReviewsData.total).toEqual(animeReviewsPayload.length);
    expect(animeReviewsData.data).toHaveLength(1);
    expect(animeReviewsData.data[0]).toEqual({
      ...toAnimeReviewResponse(animeReviewsPayload[1]),
      user: toUserResponse(users[1]),
    });

    animeReviewsResponse = await supertest(app).get(`/anime/${animeId}/reviews`).query({ page: 2, pageSize: 1 });
    expect(animeReviewsResponse.status).toBe(200);

    animeReviewsData = animeReviewsResponse.body as AnimeReviewListResponse;
    expect(animeReviewsData.total).toEqual(animeReviewsPayload.length);
    expect(animeReviewsData.data).toHaveLength(1);
    expect(animeReviewsData.data[0]).toEqual({
      ...toAnimeReviewResponse(animeReviewsPayload[0]),
      user: toUserResponse(users[0]),
    });

    animeReviewsResponse = await supertest(app).get(`/anime/${animeId}/reviews`).query({ page: 3, pageSize: 1 });
    expect(animeReviewsResponse.status).toBe(200);

    animeReviewsData = animeReviewsResponse.body as AnimeReviewListResponse;
    expect(animeReviewsData.total).toEqual(animeReviewsPayload.length);
    expect(animeReviewsData.data).toHaveLength(0);
  });

  it('should get anime reviews sorted by rating in descending order', async () => {
    const animeId = 1;

    const animeReviewsPayload = Array.from({ length: 3 }, (_, index) => ({
      id: createId(),
      rating: index + 1,
      text: 'Great anime!',
      animeId,
      userId: usersPayload[index].id,
      createdAt: new Date(),
    }));

    await prisma.animeReview.createMany({ data: animeReviewsPayload });

    const animeReviewsResponse = await supertest(app).get(`/anime/${animeId}/reviews`).query({ page: 1, pageSize: 3 });
    expect(animeReviewsResponse.status).toBe(200);

    const animeReviewsData = animeReviewsResponse.body as AnimeReviewListResponse;
    expect(animeReviewsData.data).toHaveLength(3);
    expect(animeReviewsData.total).toEqual(3);
    expect(animeReviewsData.data.map((review: AnimeReviewResponse) => review.rating)).toEqual([3, 2, 1]);

    expect(animeReviewsData.data).toEqual(
      animeReviewsPayload
        .sort((a, b) => b.rating - a.rating)
        .map((review) => ({
          ...toAnimeReviewResponse(review),
          user: toUserResponse(users.find((user) => user.id === review.userId)!),
        })),
    );
  });
});
