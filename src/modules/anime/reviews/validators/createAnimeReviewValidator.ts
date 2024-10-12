import { z } from 'zod';

export const createAnimeReviewValidator = z.object({
  animeId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().positive().min(1).max(5),
  text: z.string().min(1).max(500).optional(),
});

export type CreateAnimeReviewInput = z.infer<typeof createAnimeReviewValidator>;
