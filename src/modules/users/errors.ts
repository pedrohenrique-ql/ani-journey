import { BadRequestError, NotFoundError } from '@/errors/http';

export class UserNotFound extends NotFoundError {
  constructor(userId: string) {
    super(`User ${userId} not found.`);
  }
}

export class EmailAlreadyInUseError extends BadRequestError {
  constructor(email: string) {
    super(`Email ${email} is already in use.`);
  }
}

export class UsernameAlreadyInUseError extends BadRequestError {
  constructor(username: string) {
    super(`Username ${username} is already in use.`);
  }
}
