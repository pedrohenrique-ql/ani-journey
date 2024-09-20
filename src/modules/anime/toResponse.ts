import { Anime, AnimeList } from '@/clients/anime/types';

export interface AnimeResponse extends Anime {
  rating: number;
  favorites: number;
}

export interface SearchAnimeResponse {
  total: number;
  pageSize: number;
  page: number;
  data: Anime[];
}

export function toResponseAnimeList(animeList: AnimeList): SearchAnimeResponse {
  return {
    total: animeList.total,
    pageSize: animeList.pageSize,
    page: animeList.page,
    data: animeList.data.map((anime) => ({
      ...anime,
      rating: 0,
      favorites: 0,
    })),
  };
}

export function toResponseAnime(anime: Anime): AnimeResponse {
  return {
    ...anime,
    rating: 0,
    favorites: 0,
  };
}
