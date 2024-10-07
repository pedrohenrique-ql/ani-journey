import createApp from '@/server/app';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';
import { createId } from '@paralleldrive/cuid2';
import { Role } from '@prisma/client';

describe('Statistics (Get)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.animeReview.deleteMany();
  });

  it('should get statistics by an admin user', async () => {
    const { auth } = await createAuthenticatedUser(app, { role: 'ADMIN' });

    const usersPayload = Array.from({ length: 3 }, (_, index) => ({
      id: createId(),
      username: `user-${index}`,
      email: `email${index}@email.com`,
      role: Role.NORMAL,
      password: 'password',
    }));

    await prisma.user.createMany({ data: usersPayload });

    const animeReviewsPayload = Array.from({ length: 3 }, (_, index) => ({
      id: createId(),
      rating: 5,
      text: 'Great anime!',
      animeId: 1,
      userId: usersPayload[index].id,
    }));

    await prisma.animeReview.createMany({ data: animeReviewsPayload });

    const statisticsResponse = await supertest(app).get('/statistics').auth(auth.accessToken, { type: 'bearer' });

    expect(statisticsResponse.status).toBe(200);
    expect(statisticsResponse.body).toEqual({
      users: 4,
      reviews: 3,
    });
  });

  it('should return 403 when user is not an admin', async () => {
    const { auth } = await createAuthenticatedUser(app, { role: 'NORMAL' });

    const statisticsResponse = await supertest(app).get('/statistics').auth(auth.accessToken, { type: 'bearer' });

    expect(statisticsResponse.status).toBe(403);
    expect(statisticsResponse.body).toEqual({
      message: 'You are not authorized to access this resource',
    });
  });
});
