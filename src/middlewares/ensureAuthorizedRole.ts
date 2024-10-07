import { ForbiddenError } from '@/errors/http';
import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

function ensureAuthorizedRole(requiredRole: Role) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { role } = request.middlewares.authenticated;

      if (role !== requiredRole) {
        throw new ForbiddenError('You are not authorized to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default ensureAuthorizedRole;
