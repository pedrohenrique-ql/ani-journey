import prisma from '@/database/prismaClient';
import { GetUserInput } from './validators/GetUserValidator';
import { BadRequestError } from '@/errors/http';
import { createId } from '@paralleldrive/cuid2';
import { CreateUserInput } from './validators/CreateUserValidator';
import { UpdateUserInput } from './validators/UpdateUserValidator';
import { hashPassword } from '@/utils/auth';
import { EmailAlreadyInUseError, UsernameAlreadyInUseError, UserNotFound } from './errors';

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
    const user = await prisma.user.findFirst({ where: { id: inputData.id } });

    if (!user) {
      throw new UserNotFound(inputData.id);
    }

    return user;
  }

  async update(inputData: UpdateUserInput) {
    if (inputData.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: inputData.username, NOT: { id: inputData.id } },
      });

      if (existingUsername) {
        throw new BadRequestError(`Username ${inputData.username} is already in use.`);
      }
    }

    if (inputData.email) {
      const existingUserEmail = await prisma.user.findUnique({
        where: { email: inputData.email, NOT: { id: inputData.id } },
      });

      if (existingUserEmail) {
        throw new BadRequestError(`Email ${inputData.email} is already in use.`);
      }
    }

    const user = await this.getById({ id: inputData.id });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: inputData.username,
        email: inputData.email,
      },
    });

    return updatedUser;
  }

  async delete(inputData: GetUserInput) {
    const user = await this.getById(inputData);

    await prisma.user.delete({
      where: { id: user.id },
    });
  }
}

export default UserService;
