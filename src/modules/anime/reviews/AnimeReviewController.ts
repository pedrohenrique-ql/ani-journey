import { Request, Response } from 'express';
import AnimeReviewService from './AnimeReviewService';
import { createAnimeReviewValidator } from './validators/createAnimeReviewValidator';
import { toAnimeReviewListResponse, toAnimeReviewResponse } from './toResponse';
import { getAnimeReviewsValidator } from './validators/getAnimeReviewsValidator';
import { updateAnimeReviewValidator } from './validators/updateAnimeReviewValidator';

class AnimeReviewController {
  private animeReviewService = new AnimeReviewService();

  create = async (request: Request, response: Response) => {
    const { userId } = request.middlewares.authenticated;

    const validatedInput = createAnimeReviewValidator.parse({ ...request.body, ...request.params });
    const animeReview = await this.animeReviewService.create({ ...validatedInput, userId });

    const animeReviewResponse = toAnimeReviewResponse(animeReview);
    response.status(201).json(animeReviewResponse);
  };

  get = async (request: Request, response: Response) => {
    const validatedInput = getAnimeReviewsValidator.parse({ ...request.query, ...request.params });
    const { animeReviews, total } = await this.animeReviewService.get(validatedInput);

    const animeReviewsResponse = toAnimeReviewListResponse(animeReviews, total);
    response.status(200).json(animeReviewsResponse);
  };

  update = async (request: Request, response: Response) => {
    const { userId } = request.middlewares.authenticated;

    const validatedInput = updateAnimeReviewValidator.parse({ ...request.body, ...request.params });
    const animeReview = await this.animeReviewService.update({ ...validatedInput, userId });

    const animeReviewResponse = toAnimeReviewResponse(animeReview);
    response.status(200).json(animeReviewResponse);
  };
}

export default AnimeReviewController;
