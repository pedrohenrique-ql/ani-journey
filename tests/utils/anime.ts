import { SearchAnimeResponse } from '@/modules/anime/toResponse';
import { JikanAnimeGetByIdResponse, JikanAnimeSearchResponse } from '@/types/jikan';

export function createJikanAnimeSearchResponse(
  partialAnimeSearch: Partial<JikanAnimeSearchResponse> = {},
): JikanAnimeSearchResponse {
  return {
    pagination: {
      has_next_page: true,
      items: { per_page: 5, count: 1, total: 5 },
    },
    data: [createJikanAnimeResponse()],
    ...partialAnimeSearch,
  };
}

export function createJikanAnimeResponse(
  partialAnime: Partial<JikanAnimeGetByIdResponse> = {},
): JikanAnimeGetByIdResponse {
  return {
    mal_id: 1,
    title_english: 'Attack on Titan',
    title_japanese: '進撃の巨人',
    episodes: 25,
    synopsis: 'Synopsis',
    images: { jpg: { image_url: 'https://example.com/image.jpg' } },
    status: 'Finished Airing',
    year: 2013,
    ...partialAnime,
  };
}

export function toAnimeListResponse(jikanAnimeSearchResponse: JikanAnimeSearchResponse): SearchAnimeResponse {
  const { data = [], pagination } = jikanAnimeSearchResponse;
  return {
    total: pagination?.items?.total ?? 1,
    pageSize: pagination?.items?.per_page ?? data.length,
    page: pagination?.items?.per_page ?? 1,
    data: data.map((anime) => ({
      id: anime.mal_id ?? 1,
      englishTitle: anime.title_english ?? '',
      japaneseTitle: anime.title_japanese ?? '',
      episodes: anime.episodes ?? 0,
      synopsis: anime.synopsis ?? '',
      image: anime.images?.jpg?.image_url ?? '',
      status: anime.status ?? 'Finished Airing',
      releaseAir: anime.year ?? 2013,
      favorites: 0,
      rating: 0,
    })),
  };
}
