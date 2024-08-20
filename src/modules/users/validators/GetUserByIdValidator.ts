import { z } from 'zod';

export const getUserByIdValidator = z.object({
  id: z.string().min(1),
});

export type GetUserByIdInput = z.infer<typeof getUserByIdValidator>;
