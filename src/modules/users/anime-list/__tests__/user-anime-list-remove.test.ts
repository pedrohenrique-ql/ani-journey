import createApp from '@/server/app';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';
import { createId } from '@paralleldrive/cuid2';

describe('User Anime List (Remove)', async () => {
  const app = await createApp();
  const { auth, user } = await createAuthenticatedUser(app);

  beforeEach(async () => {
    await prisma.userAnimeList.deleteMany();
  });

  it('should remove an anime from the user anime list', async () => {
    const animeId = 1;
    await prisma.userAnimeList.create({
      data: {
        id: createId(),
        userId: user.id,
        animeId,
      },
    });

    const deleteAnimeFromUserListResponse = await supertest(app)
      .delete(`/users/${user.id}/anime-list/${animeId}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(deleteAnimeFromUserListResponse.status).toBe(204);

    const userAnimeList = await prisma.userAnimeList.findUnique({
      where: {
        userId_animeId: {
          userId: user.id,
          animeId,
        },
      },
    });
    expect(userAnimeList).toBeNull();
  });

  it('should return 404 when the user anime list is not found', async () => {
    const animeId = 1;
    const deleteAnimeFromUserListResponse = await supertest(app)
      .delete(`/users/${user.id}/anime-list/${animeId}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(deleteAnimeFromUserListResponse.status).toBe(404);
    expect(deleteAnimeFromUserListResponse.body).toEqual({
      message: `User anime list not found for user ${user.id} and anime ${animeId}.`,
    });
  });
});
