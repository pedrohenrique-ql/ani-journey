import { AnimeList, AnimeSearchParams } from './types';

interface AnimeClient {
  getAnimeSearch(searchParams: Partial<AnimeSearchParams>): Promise<AnimeList>;
}

export default AnimeClient;
