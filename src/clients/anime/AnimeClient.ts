import { Anime, AnimeList, AnimeSearchParams } from './types';

interface AnimeClient {
  getAnimeSearch(searchParams: Partial<AnimeSearchParams>): Promise<AnimeList>;
  getAnimeById(id: number): Promise<Anime>;
}

export default AnimeClient;
