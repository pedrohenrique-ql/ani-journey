import JikanClient from '@/clients/anime/implementations/JikanClient';
import { SearchAnimeInput } from './validators/searchAnimeValidator';
import { GetAnimeByIdInput } from './validators/getAnimeByIdValidator';
import { AnimeNotFound } from './errors';
import { Anime } from '@/clients/anime/types';
import prisma from '@/database/prismaClient';

const DEFAULT_BATCH_SIZE = 10;

export interface AnimeWithStatistics extends Anime {
  rating: number;
}

class AnimeService {
  private animeClient = new JikanClient();

  async search(inputData: SearchAnimeInput) {
    const animeList = await this.animeClient.getAnimeSearch({
      page: inputData.page,
      pageSize: inputData.pageSize,
      title: inputData.title,
    });

    const animeIds = animeList.data.map((anime) => anime.id);

    const reviews = await prisma.animeReview.findMany({
      where: {
        animeId: {
          in: animeIds,
        },
      },
      select: { animeId: true, rating: true },
    });

    const animeListWithRating = animeList.data.map((anime) => {
      const animeRatings = reviews.filter((review) => review.animeId === anime.id);

      if (animeRatings.length === 0) {
        return { ...anime, rating: 0 };
      }

      const totalRating = animeRatings.reduce((acc, review) => acc + review.rating, 0);
      const rating = totalRating / animeRatings.length;
      return { ...anime, rating };
    });

    return { ...animeList, data: animeListWithRating };
  }

  async getById(inputData: GetAnimeByIdInput) {
    try {
      const [anime, rating] = await Promise.all([
        this.animeClient.getAnimeById(inputData.id),
        this.getAnimeRating(inputData.id),
      ]);

      return { ...anime, rating };
    } catch {
      throw new AnimeNotFound(inputData.id);
    }
  }

  async getByIdsInBatches(animeIds: Anime['id'][], options: { batchSize?: number } = {}) {
    const { batchSize = DEFAULT_BATCH_SIZE } = options;
    const results: AnimeWithStatistics[] = [];

    for (let i = 0; i < animeIds.length; i += batchSize) {
      const batch = animeIds.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((id) => this.getById({ id })));

      results.push(...batchResults);
    }

    return results;
  }

  async getAnimeRating(animeId: Anime['id']) {
    const reviews = await prisma.animeReview.findMany({
      where: {
        animeId,
      },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  }
}

export default AnimeService;
