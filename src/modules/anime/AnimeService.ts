import JikanClient from '@/clients/anime/implementations/JikanClient';
import { SearchAnimeInput } from './validators/searchAnimeValidator';
import { GetAnimeByIdInput } from './validators/getAnimeByIdValidator';
import { AnimeNotFound } from './errors';
import { Anime } from '@/clients/anime/types';

const DEFAULT_BATCH_SIZE = 10;

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
    try {
      const anime = await this.animeClient.getAnimeById(inputData.id);

      return anime;
    } catch {
      throw new AnimeNotFound(inputData.id);
    }
  }

  async getByIdsInBatches(animeIds: Anime['id'][], options: { batchSize?: number } = {}) {
    const { batchSize = DEFAULT_BATCH_SIZE } = options;
    const results: Anime[] = [];

    for (let i = 0; i < animeIds.length; i += batchSize) {
      const batch = animeIds.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((id) => fetch(`https://api.exemplo.com/endpoint/${id}`).then((response) => response.json())),
      );

      results.push(...batchResults);
    }

    return results;
  }
}

export default AnimeService;
