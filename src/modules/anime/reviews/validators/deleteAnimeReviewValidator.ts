import { z } from 'zod';

export const deleteAnimeReviewValidator = z.object({
  animeId: z.string().cuid2(),
  reviewId: z.string().cuid2(),
  userId: z.string().cuid2(),
});

export type DeleteAnimeReviewInput = z.infer<typeof deleteAnimeReviewValidator>;
