import { WatchStatus } from '@prisma/client';
import { z } from 'zod';

export const updateUserAnimeStatusValidator = z.object({
  userId: z.string().cuid2(),
  animeId: z.coerce.number().int().positive(),
  status: z.nativeEnum(WatchStatus),
});

export type UpdateUserAnimeStatusInput = z.infer<typeof updateUserAnimeStatusValidator>;
