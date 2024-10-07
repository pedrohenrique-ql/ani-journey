import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import { createAuthenticatedUser } from '@tests/utils/auth';

describe('Anime Reviews (Delete)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

  beforeEach(async () => {
    await prisma.animeReview.deleteMany();
  });

  it('should delete an anime review', async () => {
    const animeId = 1;
    const animeReview = await prisma.animeReview.create({
      data: {
        id: createId(),
        rating: 5,
        text: 'Great anime!',
        animeId,
        userId: user.id,
      },
    });

    const deleteAnimeReviewResponse = await supertest(app)
      .delete(`/anime/${animeId}/reviews/${animeReview.id}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(deleteAnimeReviewResponse.status).toBe(204);

    const fetchedAnimeReview = await prisma.animeReview.findUnique({
      where: {
        id: animeReview.id,
      },
    });
    expect(fetchedAnimeReview).toBeNull();
  });

  it('should return 404 if the anime review does not exist', async () => {
    const animeId = 1;
    const animeReviewId = createId();

    const deleteAnimeReviewResponse = await supertest(app)
      .delete(`/anime/${animeId}/reviews/${animeReviewId}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(deleteAnimeReviewResponse.status).toBe(404);
    expect(deleteAnimeReviewResponse.body).toEqual({
      message: `Anime review ${animeReviewId} not found.`,
    });
  });

  it('should return 403 if the anime review is not owned by the user', async () => {
    const { auth: otherAuth } = await createAuthenticatedUser(app, {
      email: 'otheremail@email.com',
      username: 'otherusername',
      password: 'password',
    });

    const animeId = 1;
    const animeReview = await prisma.animeReview.create({
      data: {
        id: createId(),
        rating: 5,
        text: 'Great anime!',
        animeId,
        userId: user.id,
      },
    });

    const deleteAnimeReviewResponse = await supertest(app)
      .delete(`/anime/${animeId}/reviews/${animeReview.id}`)
      .auth(otherAuth.accessToken, { type: 'bearer' });

    expect(deleteAnimeReviewResponse.status).toBe(403);
    expect(deleteAnimeReviewResponse.body).toEqual({
      message: `Anime review ${animeReview.id} is not owned by the user.`,
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const animeId = 1;
    const animeReview = await prisma.animeReview.create({
      data: {
        id: createId(),
        rating: 5,
        text: 'Great anime!',
        animeId,
        userId: user.id,
      },
    });

    const deleteAnimeReviewResponse = await supertest(app).delete(`/anime/${animeId}/reviews/${animeReview.id}`);

    expect(deleteAnimeReviewResponse.status).toBe(401);
    expect(deleteAnimeReviewResponse.body).toEqual({
      message: 'Token not provided.',
    });
  });
});
