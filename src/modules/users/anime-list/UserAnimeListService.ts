import { AddAnimeToUserListInput } from './validators/addAnimeToListValidator';
import prisma from '@/database/prismaClient';
import { AnimeAlreadyInUserList } from './errors';
import { createId } from '@paralleldrive/cuid2';
import AnimeService from '@/modules/anime/AnimeService';
import UserService from '../UserService';
import { GetUserAnimeListInput } from './validators/getUserAnimeListValidator';

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
    const userAnimeList = await prisma.userAnimeList.findMany({
      where: { userId: inputData.userId },
      orderBy: { createdAt: 'desc' },
      skip: inputData.page * inputData.pageSize,
      take: inputData.pageSize,
    });

    const animeIds = userAnimeList.map((userAnime) => userAnime.animeId);
    const animeList = await this.animeService.getByIdsInBatches(animeIds, { batchSize: 10 });

    return { userAnimeList, animeList };
  }
}

export default UserAnimeListService;
