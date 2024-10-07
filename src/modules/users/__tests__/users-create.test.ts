import createApp from '@/server/app';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserInput } from '../validators/CreateUserValidator';
import supertest from 'supertest';
import prisma from '@/database/prismaClient';
import { Role } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

describe('Users (Create)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create a new user', async () => {
    const createUserInput: CreateUserInput = {
      username: 'username',
      email: 'email@test.com',
      password: 'password',
    };

    const createUserResponse = await supertest(app).post('/users').send(createUserInput);
    expect(createUserResponse.status).toBe(201);

    const user = await prisma.user.findUniqueOrThrow({ where: { email: createUserInput.email } });
    expect(user.username).toBe(createUserInput.username);
    expect(user.email).toBe(createUserInput.email);
    expect(user.password).not.toBe(createUserInput.password);
    expect(user.role).toBe(Role.NORMAL);

    expect(createUserResponse.body).toEqual({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  });

  it('should return 400 if email is already in use', async () => {
    const existingUser = await prisma.user.create({
      data: {
        id: createId(),
        username: 'username',
        email: 'email@test.com',
        password: 'password',
      },
    });

    const createUserInput: CreateUserInput = {
      username: 'other_username',
      email: 'email@test.com',
      password: 'password',
    };

    const createUserResponse = await supertest(app).post('/users').send(createUserInput);
    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body).toEqual({
      message: `Email ${createUserInput.email} is already in use.`,
    });

    const users = await prisma.user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe(existingUser.username);
  });

  it('should return 400 if username is already in use', async () => {
    const existingUser = await prisma.user.create({
      data: {
        id: createId(),
        username: 'username',
        email: 'email@test.com',
        password: 'password',
      },
    });

    const createUserInput: CreateUserInput = {
      username: 'username',
      email: 'other_email@test.com',
      password: 'password',
    };

    const createUserResponse = await supertest(app).post('/users').send(createUserInput);
    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body).toEqual({
      message: `Username ${createUserInput.username} is already in use.`,
    });

    const users = await prisma.user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe(existingUser.username);
  });

  it('should return 400 if email is invalid', async () => {
    const createUserInput: CreateUserInput = {
      username: 'username',
      email: 'invalid_email',
      password: 'password',
    };

    const createUserResponse = await supertest(app).post('/users').send(createUserInput);
    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body).toEqual({ message: 'Validation error.' });

    const users = await prisma.user.findMany();
    expect(users).toHaveLength(0);
  });

  it('should return 400 if username is not invalid', async () => {
    const createUserInput: CreateUserInput = {
      username: '',
      email: 'email@test.com',
      password: 'password',
    };

    const createUserResponse = await supertest(app).post('/users').send(createUserInput);
    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body).toEqual({ message: 'Validation error.' });

    const users = await prisma.user.findMany();
    expect(users).toHaveLength(0);
  });
});
