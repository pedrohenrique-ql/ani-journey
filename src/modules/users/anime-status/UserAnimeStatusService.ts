import prisma from '@/database/prismaClient';
import { UpdateUserAnimeStatusInput } from './validators/updateUserAnimeStatusValidator';
import { createId } from '@paralleldrive/cuid2';
import UserService from '../UserService';
import { GetUserAnimeStatusInput } from './validators/getUserAnimeStatusValidator';
import { UserAnimeStatusNotFound } from './errors';

class UserAnimeStatusService {
  private userService = new UserService();

  async updateUserAnimeStatus(inputData: UpdateUserAnimeStatusInput) {
    const user = await this.userService.getById({ id: inputData.userId });

    const existingUserAnimeStatus = await prisma.userAnimeStatus.findFirst({
      where: {
        userId: user.id,
        animeId: inputData.animeId,
      },
    });

    if (existingUserAnimeStatus) {
      await prisma.userAnimeStatus.update({
        where: {
          id: existingUserAnimeStatus.id,
        },
        data: {
          status: inputData.status,
        },
      });
    } else {
      await prisma.userAnimeStatus.create({
        data: {
          id: createId(),
          userId: user.id,
          animeId: inputData.animeId,
          status: inputData.status,
        },
      });
    }

    return { userId: user.id, animeId: inputData.animeId, status: inputData.status };
  }

  async getByUserIdAndAnimeId(inputData: GetUserAnimeStatusInput) {
    const userAnimeStatus = await prisma.userAnimeStatus.findUnique({
      where: {
        userId_animeId: {
          userId: inputData.userId,
          animeId: inputData.animeId,
        },
      },
    });

    if (!userAnimeStatus) {
      throw new UserAnimeStatusNotFound(inputData.userId, inputData.animeId);
    }

    return userAnimeStatus;
  }
}

export default UserAnimeStatusService;
