import { AnimeReview } from '@prisma/client';

export interface AnimeReviewResponse {
  id: string;
  rating: number;
  text: string;
  animeId: number;
  userId: string;
  createdAt: string;
}

export function toAnimeReviewResponse(animeReview: AnimeReview) {
  return {
    id: animeReview.id,
    rating: animeReview.rating,
    text: animeReview.text,
    animeId: animeReview.animeId,
    userId: animeReview.userId,
    createdAt: animeReview.createdAt.toISOString(),
  };
}
