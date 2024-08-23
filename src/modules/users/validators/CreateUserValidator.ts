import { z } from 'zod';

export const createUserValidator = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserValidator>;
