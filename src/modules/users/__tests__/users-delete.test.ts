import createApp from '@/server/app';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { createId } from '@paralleldrive/cuid2';

describe('Users (Delete)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should delete an user', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const deleteUserResponse = await supertest(app)
      .delete(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(deleteUserResponse.status).toBe(204);

    const userExists = await prisma.user.findUnique({ where: { id: user.id } });
    expect(userExists).toBeNull();
  });

  it('should return 404 if user does not exist', async () => {
    const { auth } = await createAuthenticatedUser(app);
    const invalidUserId = createId();

    const deleteUserResponse = await supertest(app)
      .delete(`/users/${invalidUserId}`)
      .auth(auth.accessToken, { type: 'bearer' });

    expect(deleteUserResponse.status).toBe(404);
    expect(deleteUserResponse.body).toEqual({ message: `User ${invalidUserId} not found.` });
  });

  it('should return 401 if user is not authenticated', async () => {
    const { user } = await createAuthenticatedUser(app);

    const deleteUserResponse = await supertest(app).delete(`/users/${user.id}`);

    expect(deleteUserResponse.status).toBe(401);
    expect(deleteUserResponse.body).toEqual({ message: 'Token not provided.' });
  });
});
