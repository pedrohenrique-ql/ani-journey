import { Anime, AnimeClient as JikanAnimeClient, JikanResponse } from '@tutkli/jikan-ts';
import { AnimeList, AnimeSearchParams } from '../types';
import AnimeClient from '../AnimeClient';

class JikanClient implements AnimeClient {
  private animeClient = new JikanAnimeClient();

  async getAnimeSearch(searchParams: Partial<AnimeSearchParams>) {
    const animeList = await this.animeClient.getAnimeSearch({
      page: searchParams.page,
      limit: searchParams.pageSize,
      q: searchParams.title,
    });

    return this.mapAnime(animeList);
  }

  private mapAnime(animeList: JikanResponse<Anime[]>): AnimeList {
    return {
      total: animeList.pagination?.items?.total ?? 0,
      pageSize: animeList.pagination?.items?.per_page ?? animeList.data.length,
      page: animeList.pagination?.items?.per_page ?? 1,
      data: animeList.data.map((anime) => ({
        id: anime.mal_id,
        englishTitle: anime.title_english,
        japaneseTitle: anime.title_japanese,
        episodes: anime.episodes,
        synopsis: anime.synopsis,
        image: anime.images.jpg.image_url,
        status: anime.status,
        releaseAir: anime.year,
      })),
    };
  }
}

export default JikanClient;
