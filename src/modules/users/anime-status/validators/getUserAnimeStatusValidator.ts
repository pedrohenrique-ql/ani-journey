import { WatchStatus } from '@prisma/client';
import { z } from 'zod';

export const getUserAnimeStatusValidator = z.object({
  userId: z.string().cuid2(),
  animeId: z.coerce.number().int().positive(),
});

export type GetUserAnimeStatusInput = z.infer<typeof getUserAnimeStatusValidator>;
