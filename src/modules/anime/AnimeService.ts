import JikanClient from '@/clients/anime/implementations/JikanClient';
import { SearchAnimeInput } from './validators/searchAnimeValidator';

class AnimeService {
  private animeClient = new JikanClient();

  async search(inputData: SearchAnimeInput) {
    return this.animeClient.getAnimeSearch({
      page: inputData.page,
      pageSize: inputData.pageSize,
      title: inputData.title,
    });
  }
}

export default AnimeService;
