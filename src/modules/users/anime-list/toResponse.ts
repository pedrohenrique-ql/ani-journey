import { Anime } from '@/clients/anime/types';
import { toAnimeResponse } from '@/modules/anime/toResponse';
import { User } from '@prisma/client';

export function toUserAnimeListResponse(
  userId: User['id'],
  animeList: Anime[],
  pagination: { page: number; total: number },
) {
  return {
    userId,
    total: pagination.total,
    page: pagination.page,
    data: animeList.map((anime) => toAnimeResponse(anime)),
  };
}
