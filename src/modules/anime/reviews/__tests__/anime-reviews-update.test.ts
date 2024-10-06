import prisma from '@/database/prismaClient';
import createApp from '@/server/app';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { AnimeReviewResponse } from '../toResponse';
import { createId } from '@paralleldrive/cuid2';
import { AnimeReview, Role } from '@prisma/client';
import { createAuthenticatedUser } from '@tests/utils/auth';

describe('Anime Reviews (Update)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

  let animeReview: AnimeReview;
  const animeId = 1;

  beforeEach(async () => {
    await prisma.animeReview.deleteMany();

    animeReview = await prisma.animeReview.create({
      data: {
        id: createId(),
        rating: 5,
        text: 'Great anime!',
        animeId,
        userId: user.id,
      },
    });
  });

  it('should update an anime review', async () => {
    const updateAnimeReviewResponse = await supertest(app)
      .put(`/anime/${animeId}/reviews/${animeReview.id}`)
      .send({ rating: 4, text: 'Good anime!' })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(updateAnimeReviewResponse.status).toBe(200);
    const updatedAnimeReview = updateAnimeReviewResponse.body as AnimeReviewResponse;

    expect(updatedAnimeReview).toEqual({
      id: animeReview.id,
      rating: 4,
      text: 'Good anime!',
      animeId,
      userId: user.id,
      createdAt: expect.any(String),
    });

    const fetchedAnimeReview = await prisma.animeReview.findUnique({
      where: {
        id: animeReview.id,
      },
    });

    expect(fetchedAnimeReview).not.toBeNull();
    expect(fetchedAnimeReview).toEqual({
      ...updatedAnimeReview,
      createdAt: new Date(updatedAnimeReview.createdAt),
    });
  });

  it('should return 404 if the anime review does not exist', async () => {
    const invalidAnimeReviewId = createId();
    const updateAnimeReviewResponse = await supertest(app)
      .put(`/anime/${animeId}/reviews/${invalidAnimeReviewId}`)
      .send({ rating: 4, text: 'Good anime!' })
      .auth(auth.accessToken, { type: 'bearer' });

    expect(updateAnimeReviewResponse.status).toBe(404);
    expect(updateAnimeReviewResponse.body).toEqual({
      message: `Anime review ${invalidAnimeReviewId} not found.`,
    });
  });

  it('should return 403 if the user is not the owner of the anime review', async () => {
    const { auth: otherAuth } = await createAuthenticatedUser(app, {
      email: 'otheremail@email.com',
      username: 'otherusername',
      password: 'password',
    });

    const updateAnimeReviewResponse = await supertest(app)
      .put(`/anime/${animeId}/reviews/${animeReview.id}`)
      .send({ rating: 4, text: 'Good anime!' })
      .auth(otherAuth.accessToken, { type: 'bearer' });

    expect(updateAnimeReviewResponse.status).toBe(403);
    expect(updateAnimeReviewResponse.body).toEqual({
      message: `Anime review ${animeReview.id} is not owned by the user.`,
    });

    const fetchedAnimeReview = await prisma.animeReview.findUnique({
      where: {
        id: animeReview.id,
      },
    });

    expect(fetchedAnimeReview).not.toBeNull();
    expect(fetchedAnimeReview).toEqual(animeReview);
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await supertest(app).put(`/anime/${animeId}/reviews/${animeReview.id}`).send();
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token not provided.' });
  });
});
