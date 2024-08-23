import { z } from 'zod';

export const deleteUserValidator = z.object({
  id: z.string().cuid2(),
});

export type DeleteUserInput = z.infer<typeof deleteUserValidator>;
