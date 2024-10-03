import { User } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../../errors/http';
import { Anime } from '@/clients/anime/types';

export class AnimeAlreadyInUserList extends BadRequestError {
  constructor(animeId: Anime['id']) {
    super(`Anime ${animeId} is already in user list.`);
  }
}

export class UserAnimeListNotFound extends NotFoundError {
  constructor(userId: User['id'], animeId: Anime['id']) {
    super(`User anime list not found for user ${userId} and anime ${animeId}.`);
  }
}
