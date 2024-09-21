import createApp from '@/server/app';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';
import { createAuthenticatedUser } from '@tests/utils/auth';
import supertest from 'supertest';
import { createId } from '@paralleldrive/cuid2';

describe('Users (Update)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should update username and email', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const updateUserResponse = await supertest(app)
      .patch(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        username: 'new-username',
        email: 'new_email@email.com',
      });

    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body).toEqual({
      id: user.id,
      username: 'new-username',
      email: 'new_email@email.com',
      role: user.role,
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updatedUser!).toEqual({
      ...user,
      username: 'new-username',
      email: 'new_email@email.com',
      updatedAt: expect.any(Date),
    });
  });

  it('should update only username', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const updateUserResponse = await supertest(app)
      .patch(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        username: 'new-username',
      });

    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body).toEqual({
      id: user.id,
      username: 'new-username',
      email: user.email,
      role: user.role,
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updatedUser!).toEqual({
      ...user,
      username: 'new-username',
      updatedAt: expect.any(Date),
    });
  });

  it('should update only email', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const updateUserResponse = await supertest(app)
      .patch(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        email: 'new_email@email.com',
      });

    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body).toEqual({
      id: user.id,
      username: user.username,
      email: 'new_email@email.com',
      role: user.role,
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updatedUser!).toEqual({
      ...user,
      email: 'new_email@email.com',
      updatedAt: expect.any(Date),
    });
  });

  it('should return 404 if user does not exist', async () => {
    const { auth } = await createAuthenticatedUser(app);
    const invalidUserId = createId();

    const updateUserResponse = await supertest(app)
      .patch(`/users/${invalidUserId}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        username: 'new-username',
        email: 'new_email@email.com',
      });

    expect(updateUserResponse.status).toBe(404);
    expect(updateUserResponse.body).toEqual({ message: `User ${invalidUserId} not found.` });
  });

  it('should return 400 if email is already in use', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const existingUser = await prisma.user.create({
      data: {
        id: createId(),
        username: 'other-username',
        email: 'other_email@email.com',
        password: 'password',
      },
    });

    const updateUserResponse = await supertest(app)
      .patch(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        email: existingUser.email,
      });

    expect(updateUserResponse.status).toBe(400);
    expect(updateUserResponse.body).toEqual({ message: `Email ${existingUser.email} is already in use.` });
  });

  it('should return 400 if username is already in use', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const existingUser = await prisma.user.create({
      data: {
        id: createId(),
        username: 'other-username',
        email: 'other_email@email.com',
        password: 'password',
      },
    });

    const updateUserResponse = await supertest(app)
      .patch(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        username: existingUser.username,
      });

    expect(updateUserResponse.status).toBe(400);
    expect(updateUserResponse.body).toEqual({ message: `Username ${existingUser.username} is already in use.` });
  });

  it('should return 400 if email is invalid', async () => {
    const { user, auth } = await createAuthenticatedUser(app);

    const updateUserResponse = await supertest(app)
      .patch(`/users/${user.id}`)
      .auth(auth.accessToken, { type: 'bearer' })
      .send({
        email: 'invalid-email',
      });

    expect(updateUserResponse.status).toBe(400);
    expect(updateUserResponse.body).toEqual({ message: 'Validation error.' });
  });

  it('should return 401 if user is not authenticated', async () => {
    const { user } = await createAuthenticatedUser(app);

    const deleteUserResponse = await supertest(app).delete(`/users/${user.id}`);

    expect(deleteUserResponse.status).toBe(401);
    expect(deleteUserResponse.body).toEqual({ message: 'Token not provided.' });
  });
});
