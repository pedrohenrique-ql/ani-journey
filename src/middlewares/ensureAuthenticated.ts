import { UnauthorizedError } from '@/errors/http';
import { verifyJWT } from '@/utils/auth';
import { NextFunction, Request, Response } from 'express';

async function ensureAuthenticated(request: Request, _response: Response, next: NextFunction) {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new UnauthorizedError('Token not provided.');
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    throw new UnauthorizedError('Invalid token.');
  }

  try {
    const { userId, role } = await verifyJWT(token);

    request.middlewares.authenticated = { userId, role };
  } catch (error) {
    throw new UnauthorizedError('Invalid token.');
  }
}

export default ensureAuthenticated;
