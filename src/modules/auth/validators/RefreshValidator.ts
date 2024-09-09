import { z } from 'zod';

export const refreshValidator = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshInput = z.infer<typeof refreshValidator>;
