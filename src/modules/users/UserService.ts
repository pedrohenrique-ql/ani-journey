import prisma from '@/database/prismaClient';
import { GetUserByIdInput } from './validators/GetUserByIdValidator';
import { BadRequestError, NotFoundError } from '@/errors/http';
import { createId } from '@paralleldrive/cuid2';
import { CreateUserInput } from './validators/CreateUserValidator';
import { hashPassword } from '@/utils/password';
import { UpdateUserInput } from './validators/UpdateUserValidator';

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

    const createdUser = await prisma.user.create({
      data: {
        id: createId(),
        username: inputData.username,
        email: inputData.email,
        password: await hashPassword(inputData.password),
      },
    });

    return createdUser;
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

  async update(inputData: UpdateUserInput) {
    if (inputData.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: inputData.username, NOT: { id: inputData.id } },
      });

      if (existingUsername) {
        throw new BadRequestError('Username is already in use.');
      }
    }

    if (inputData.email) {
      const existingUserEmail = await prisma.user.findUnique({
        where: { email: inputData.email, NOT: { id: inputData.id } },
      });

      if (existingUserEmail) {
        throw new BadRequestError('Email is already in use.');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: inputData.id },
      data: {
        username: inputData.username,
        email: inputData.email,
      },
    });

    return updatedUser;
  }
}

export default UserService;
