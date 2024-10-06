import { ForbiddenError, NotFoundError } from '@/errors/http';
import { AnimeReview } from '@prisma/client';

export class AnimeReviewNotFoundError extends NotFoundError {
  constructor(animeReviewId: AnimeReview['id']) {
    super(`Anime review ${animeReviewId} not found.`);
  }
}

export class AnimeReviewNotOwnedError extends ForbiddenError {
  constructor(animeReviewId: AnimeReview['id']) {
    super(`Anime review ${animeReviewId} is not owned by the user.`);
  }
}
