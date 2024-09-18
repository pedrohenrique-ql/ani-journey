import AnimeService from './AnimeService';
import { Request, Response } from 'express';
import { searchAnimeValidator } from './validators/searchAnimeValidator';
import { toResponseAnimeList } from './toResponse';

class AnimeController {
  private animeService = new AnimeService();

  getAll = async (request: Request, response: Response) => {
    const validatedInput = searchAnimeValidator.parse(request.body);
    const animeList = await this.animeService.search(validatedInput);

    const animeListResponse = toResponseAnimeList(animeList);
    response.status(201).json(animeListResponse);
  };
}

export default AnimeController;
