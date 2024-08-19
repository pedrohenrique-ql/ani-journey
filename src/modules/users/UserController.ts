import UserService from './UserService';
import { Request, Response } from 'express';
import { getUserByIdValidator } from './validators/GetUserByIdValidator';
import { ZodError } from 'zod';
import { createUserValidator } from './validators/CreateUserValidator';

class UserController {
  private userService = new UserService();

  async getById(request: Request, response: Response) {
    try {
      const validatedInput = getUserByIdValidator.parse(request.params);
      const user = await this.userService.getById(validatedInput);

      if (user) {
        response.json({ id: user.id, username: user.username, email: user.email });
      } else {
        response.status(404).send(`User ${validatedInput.id} not found`);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ message: 'Validation error' });
      } else {
        response.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

export default UserController;
