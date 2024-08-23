import prisma from '@/database/client';
import { GetUserByIdInput } from './validators/GetUserByIdValidator';
import { BadRequestError, NotFoundError } from '@/errors/http';
import { createId } from '@paralleldrive/cuid2';
import { CreateUserInput } from './validators/CreateUserValidator';
import { hashPassword } from '@/utils/password';

class UserService {
  async create(inputData: CreateUserInput) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: inputData.username },
    });

    if (existingUsername) {
      throw new BadRequestError('Username is already in use.');
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: { email: inputData.email },
    });

    if (existingUserEmail) {
      throw new BadRequestError('Email is already in use.');
    }

    const user = await prisma.user.create({
      data: {
        id: createId(),
        username: inputData.username,
        email: inputData.email,
        password: await hashPassword(inputData.password),
      },
    });

    return user;
  }

  async getById(inputData: GetUserByIdInput) {
    const user = await prisma.user.findFirst({
      where: { id: inputData.id },
    });

    if (!user) {
      throw new NotFoundError(`User ${inputData.id} not found.`);
    }

    return user;
  }
}

export default UserService;
