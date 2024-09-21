import { z } from 'zod';

export const getAnimeByIdValidator = z.object({
  id: z.coerce.number().int().positive(),
});

export type GetAnimeByIdInput = z.infer<typeof getAnimeByIdValidator>;
