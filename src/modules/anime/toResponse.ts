import { Anime, AnimeList } from '@/clients/anime/types';

export interface AnimeResponse extends Anime {
  rating: number;
  favorites: number;
}

export interface SearchAnimeResponse {
  total: number;
  data: Anime[];
}

export function toAnimeListResponse(animeList: AnimeList): SearchAnimeResponse {
  return {
    total: animeList.total,
    data: animeList.data.map((anime) => ({
      ...anime,
      rating: 0,
      favorites: 0,
    })),
  };
}

export function toAnimeResponse(anime: Anime): AnimeResponse {
  return {
    ...anime,
    rating: 0,
    favorites: 0,
  };
}
