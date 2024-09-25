import { z } from 'zod';

export const addAnimeToUserListValidator = z.object({
  userId: z.string().cuid2(),
  animeId: z.coerce.number().int().positive(),
});

export type AddAnimeToUserListInput = z.infer<typeof addAnimeToUserListValidator>;
