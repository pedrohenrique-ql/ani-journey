import { AnimeReview } from '@prisma/client';
import { AnimeReviewWithUser } from './AnimeReviewService';
import { toUserResponse, UserResponse } from '@/modules/users/toResponse';

export interface AnimeReviewResponse {
  id: AnimeReview['id'];
  rating: AnimeReview['rating'];
  text: AnimeReview['text'];
  animeId: AnimeReview['animeId'];
  userId: AnimeReview['userId'];
  createdAt: string;
}

export interface AnimeReviewListResponse {
  total: number;
  data: (AnimeReviewResponse & { user: UserResponse })[];
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

export function toAnimeReviewListResponse(animeReviews: AnimeReviewWithUser[], total: number): AnimeReviewListResponse {
  return {
    total,
    data: animeReviews.map((animeReview) => ({
      ...toAnimeReviewResponse(animeReview),
      user: toUserResponse(animeReview.user),
    })),
  };
}
