import prisma from '@/database/prismaClient';
import { CreateUserInput } from '@/modules/users/validators/CreateUserValidator';
import { hashPassword, verifyPassword } from '@/utils/auth';
import { createId } from '@paralleldrive/cuid2';

export async function createUser(partialUser: Partial<CreateUserInput> = {}) {
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
