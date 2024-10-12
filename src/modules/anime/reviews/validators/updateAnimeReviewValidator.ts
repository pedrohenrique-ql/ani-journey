import { z } from 'zod';

export const updateAnimeReviewValidator = z.object({
  text: z.string().min(1).max(500).optional(),
  rating: z.number().int().min(1).max(5),
  reviewId: z.string().cuid2(),
  userId: z.string().cuid2(),
  animeId: z.coerce.number().int().positive(),
});

export type UpdateAnimeReviewInput = z.infer<typeof updateAnimeReviewValidator>;
