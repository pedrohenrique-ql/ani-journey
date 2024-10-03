import { AddAnimeToUserListInput } from './validators/addAnimeToUserListValidator';
import prisma from '@/database/prismaClient';
import { AnimeAlreadyInUserList, UserAnimeListNotFound } from './errors';
import { createId } from '@paralleldrive/cuid2';
import AnimeService from '@/modules/anime/AnimeService';
import UserService from '../UserService';
import { GetUserAnimeListInput } from './validators/getUserAnimeListValidator';
import { RemoveAnimeFromUserListInput } from './validators/removeAnimeFromUserListValidator';

class UserAnimeListService {
  private userService = new UserService();
  private animeService = new AnimeService();

  async addAnimeToUserList(inputData: AddAnimeToUserListInput) {
    const existingUserAnimeList = await prisma.userAnimeList.findFirst({
      where: { animeId: inputData.animeId, userId: inputData.userId },
    });

    if (existingUserAnimeList) {
      throw new AnimeAlreadyInUserList(inputData.animeId);
    }

    const user = await this.userService.getById({ id: inputData.userId });
    const anime = await this.animeService.getById({ id: inputData.animeId });

    const createdData = await prisma.userAnimeList.create({
      data: { id: createId(), animeId: anime.id, userId: user.id },
    });

    return createdData;
  }

  async getAll(inputData: GetUserAnimeListInput) {
    const user = await this.userService.getById({ id: inputData.userId });

    const userAnimeList = await prisma.userAnimeList.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: (inputData.page - 1) * inputData.pageSize,
      take: inputData.pageSize,
    });

    const total = await prisma.userAnimeList.count({ where: { userId: inputData.userId } });

    const animeIds = userAnimeList.map((userAnime) => userAnime.animeId);
    const animeList = await this.animeService.getByIdsInBatches(animeIds, { batchSize: 10 });

    return { userAnimeList, animeList, total };
  }

  async remove(inputData: RemoveAnimeFromUserListInput) {
    const userAnimeList = await prisma.userAnimeList.findUnique({
      where: {
        userId_animeId: { userId: inputData.userId, animeId: inputData.animeId },
      },
    });

    if (!userAnimeList) {
      throw new UserAnimeListNotFound(inputData.userId, inputData.animeId);
    }

    await prisma.userAnimeList.delete({ where: { id: userAnimeList.id } });
  }
}

export default UserAnimeListService;
