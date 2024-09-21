import AnimeService from './AnimeService';
import { Request, Response } from 'express';
import { searchAnimeValidator } from './validators/searchAnimeValidator';
import { getAnimeByIdValidator } from './validators/getAnimeByIdValidator';
import { AnimeResponse, SearchAnimeResponse, toAnimeResponse, toAnimeListResponse } from './toResponse';

class AnimeController {
  private animeService = new AnimeService();

  getAll = async (request: Request, response: Response) => {
    const validatedInput = searchAnimeValidator.parse(request.query);
    const animeList = await this.animeService.search(validatedInput);

    const animeListResponse = toAnimeListResponse(animeList);
    response.status(200).json(animeListResponse satisfies SearchAnimeResponse);
  };

  getById = async (request: Request, response: Response) => {
    const validatedInput = getAnimeByIdValidator.parse(request.params);
    const anime = await this.animeService.getById(validatedInput);

    const animeResponse = toAnimeResponse(anime);
    response.status(200).json(animeResponse satisfies AnimeResponse);
  };
}

export default AnimeController;
