export interface AnimeSearchParams {
  page?: number;
  pageSize?: number;
  title?: string;
}

export interface Anime {
  id: number;
  englishTitle?: string;
  japaneseTitle: string;
  episodes: number;
  synopsis: string;
  image: string;
  status: string;
  releaseAir: number;
}

export interface AnimeList {
  total: number;
  pageSize: number;
  page: number;
  data: Anime[];
}
