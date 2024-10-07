import { Anime, AnimeList } from '@/clients/anime/types';
import { AnimeWithStatistics } from './AnimeService';

export interface AnimeResponse extends Anime {
  rating: number;
  favorites: number;
}

export interface SearchAnimeResponse {
  total: number;
  animeList: Anime[];
}

export function toAnimeListResponse(animeList: AnimeList): SearchAnimeResponse {
  return {
    total: animeList.total,
    animeList: animeList.data.map((anime) => ({
      ...anime,
      favorites: 0,
    })),
  };
}

export function toAnimeResponse(anime: AnimeWithStatistics): AnimeResponse {
  return {
    ...anime,
    favorites: 0,
  };
}
