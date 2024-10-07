import prisma from '@/database/prismaClient';
import { hashPassword } from '@/utils/auth';
import { createId } from '@paralleldrive/cuid2';
import { User } from '@prisma/client';

export async function createUser(partialUser: Partial<User> = {}) {
  const { password, ...restPartialUser } = partialUser;
  const userPassword = password ?? 'password';
  const hashedPassword = await hashPassword(userPassword);

  const data = {
    id: createId(),
    username: 'user',
    email: 'email@test.com',
    password: hashedPassword,
    ...restPartialUser,
  };

  const createdUser = await prisma.user.create({
    data,
  });

  return { user: createdUser, password: userPassword };
}
