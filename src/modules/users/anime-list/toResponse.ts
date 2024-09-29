import { Anime } from '@/clients/anime/types';
import { toAnimeResponse } from '@/modules/anime/toResponse';
import { UserAnimeList } from '@prisma/client';

export function toUserAnimeListResponse(
  userAnimeListId: UserAnimeList['id'],
  animeList: Anime[],
  pagination: { page: number; total: number },
) {
  return {
    id: userAnimeListId,
    total: pagination.total,
    page: pagination.page,
    data: animeList.map((anime) => toAnimeResponse(anime)),
  };
}
