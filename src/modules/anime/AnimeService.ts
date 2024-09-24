import JikanClient from '@/clients/anime/implementations/JikanClient';
import { SearchAnimeInput } from './validators/searchAnimeValidator';
import { GetAnimeByIdInput } from './validators/getAnimeByIdValidator';
import { AnimeNotFound } from './errors';

class AnimeService {
  private animeClient = new JikanClient();

  async search(inputData: SearchAnimeInput) {
    return this.animeClient.getAnimeSearch({
      page: inputData.page,
      pageSize: inputData.pageSize,
      title: inputData.title,
    });
  }

  async getById(inputData: GetAnimeByIdInput) {
    const anime = await this.animeClient.getAnimeById(inputData.id);

    if (!anime) {
      throw new AnimeNotFound(inputData.id);
    }

    return anime;
  }
}

export default AnimeService;
