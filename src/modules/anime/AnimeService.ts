import JikanClient from '@/clients/anime/implementations/JikanClient';
import { SearchAnimeInput } from './validators/searchAnimeValidator';
import { GetAnimeByIdInput } from './validators/getAnimeByIdValidator';

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
    return this.animeClient.getAnimeById(inputData.id);
  }
}

export default AnimeService;
