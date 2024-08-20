import { NextFunction, Request, Response } from 'express';
import { BadRequestError, HttpError } from './http';
import { ZodError } from 'zod';

function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    const httpError = new BadRequestError('Validation error');

    return response.status(httpError.status).json({ message: httpError.message });
  }

  if (error instanceof HttpError) {
    return response.status(error.status).json({ message: error.message });
  }

  if (error instanceof Error) {
    return response.status(500).json({ message: error.message });
  }
}

export default errorHandler;
