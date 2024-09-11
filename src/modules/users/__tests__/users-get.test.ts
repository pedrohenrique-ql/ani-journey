import createApp from '@/server/app';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';

describe('Users (Get)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should get an user by id', async () => {});

  it('should return 404 if user does not exist', async () => {});
});
