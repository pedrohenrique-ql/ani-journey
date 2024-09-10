import prisma from '@/database/prismaClient';
import { GetUserInput } from './validators/GetUserValidator';
import { BadRequestError, NotFoundError } from '@/errors/http';
import { createId } from '@paralleldrive/cuid2';
import { CreateUserInput } from './validators/CreateUserValidator';
import { UpdateUserInput } from './validators/UpdateUserValidator';
import { hashPassword } from '@/utils/auth';
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from './errors';

class UserService {
  async create(inputData: CreateUserInput) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: inputData.username },
    });

    if (existingUsername) {
      throw new UsernameAlreadyInUseError(inputData.username);
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: { email: inputData.email },
    });

    if (existingUserEmail) {
      throw new EmailAlreadyInUseError(inputData.email);
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

  async getById(inputData: GetUserInput) {
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

  async delete(inputData: GetUserInput) {
    await prisma.user.delete({
      where: { id: inputData.id },
    });
  }
}

export default UserService;
