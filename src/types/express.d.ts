import { UserTokenPayload } from '@/utils/auth';
import type { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      middlewares: {
        authenticated: UserTokenPayload;
      };
    }
  }
}
