import { z } from 'zod';

export const getAnimeReviewsValidator = z.object({
  animeId: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export type GetAnimeReviewsInput = z.infer<typeof getAnimeReviewsValidator>;
