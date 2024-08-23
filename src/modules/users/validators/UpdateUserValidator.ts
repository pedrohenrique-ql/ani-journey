import { z } from 'zod';

export const updateUserValidator = z.object({
  id: z.string().cuid2(),
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserValidator>;
