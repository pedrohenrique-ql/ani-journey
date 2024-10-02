import { Request, Response } from 'express';
import AnimeReviewService from './AnimeReviewService';
import { createAnimeReviewValidator } from './validators/createAnimeReviewValidator';

class AnimeReviewController {
  private animeReviewService = new AnimeReviewService();

  async create(request: Request, response: Response) {
    const { userId } = request.middlewares.authenticated;

    const validatedInput = createAnimeReviewValidator.parse(request.body);
    const animeReview = await this.animeReviewService.create(validatedInput);
  }
}

export default AnimeReviewController;
