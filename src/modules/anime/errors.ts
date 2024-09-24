import { NotFoundError } from '@/errors/http';

export class AnimeNotFound extends NotFoundError {
  constructor(animeId: number) {
    super(`Anime ${animeId} not found.`);
  }
}
