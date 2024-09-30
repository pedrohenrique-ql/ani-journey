import { BadRequestError } from '../../../errors/http';

export class AnimeAlreadyInUserList extends BadRequestError {
  constructor(animeId: number) {
    super(`Anime ${animeId} is already in user list.`);
  }
}
