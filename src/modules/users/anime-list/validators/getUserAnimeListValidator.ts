import { z } from 'zod';

export const getUserAnimeListValidator = z.object({
  userId: z.string().cuid2(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  title: z.string().optional(),
});

export type GetUserAnimeListInput = z.infer<typeof getUserAnimeListValidator>;
