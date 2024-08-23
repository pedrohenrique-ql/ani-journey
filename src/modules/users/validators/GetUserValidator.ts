import { z } from 'zod';

export const getUserValidator = z.object({
  id: z.string().cuid2(),
});

export type GetUserInput = z.infer<typeof getUserValidator>;
