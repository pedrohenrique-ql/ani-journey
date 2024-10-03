import { z } from 'zod';

export const removeAnimeFromUserListValidator = z.object({
  userId: z.string().cuid2(),
  animeId: z.coerce.number().int().positive(),
});

export type RemoveAnimeFromUserListInput = z.infer<typeof removeAnimeFromUserListValidator>;
