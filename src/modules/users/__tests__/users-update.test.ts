import createApp from '@/server/app';
import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '@/database/prismaClient';

describe('Users (Delete)', async () => {
  const app = await createApp();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should update username and email', async () => {});

  it('should update only username', async () => {});

  it('should update only email', async () => {});

  it('should return 404 if user does not exist', async () => {});

  it('should return 400 if email is already in use', async () => {});

  it('should return 400 if email is invalid', async () => {});

  it('should return 400 if username is already in use', async () => {});

  it('should return 400 if username is invalid', async () => {});
});
