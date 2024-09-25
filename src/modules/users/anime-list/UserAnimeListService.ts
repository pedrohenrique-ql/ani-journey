import { AddAnimeToUserListInput } from './validators/addAnimeToListValidator';
import prisma from '@/database/prismaClient';
import { AnimeAlreadyInUserList } from './errors';
import { createId } from '@paralleldrive/cuid2';
import AnimeService from '@/modules/anime/AnimeService';
import UserService from '../UserService';

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
}

export default UserAnimeListService;
