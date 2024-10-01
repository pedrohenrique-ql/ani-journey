import { NotFoundError } from '@/errors/http';

export class UserAnimeStatusNotFound extends NotFoundError {
  constructor(userId: string, animeId: number) {
    super(`User anime status not found for user ${userId} and anime ${animeId}.`);
  }
}
