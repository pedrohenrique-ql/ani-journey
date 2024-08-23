import { z } from 'zod';

export const getUserByIdValidator = z.object({
  id: z.string().cuid2(),
});

export type GetUserByIdInput = z.infer<typeof getUserByIdValidator>;
