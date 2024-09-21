import { z } from 'zod';

export const searchAnimeValidator = z.object({
  pageSize: z.coerce.number().int().positive().optional().default(10),
  page: z.coerce.number().int().positive().optional().default(1),
  title: z.string().optional(),
});

export type SearchAnimeInput = z.infer<typeof searchAnimeValidator>;
