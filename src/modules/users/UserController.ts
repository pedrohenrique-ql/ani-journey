import UserService from './UserService';
import { Request, Response } from 'express';
import { getUserByIdValidator } from './validators/GetUserByIdValidator';
import { createUserValidator } from './validators/CreateUserValidator';

class UserController {
  private userService = new UserService();

  create = async (request: Request, response: Response) => {
    const validatedInput = createUserValidator.parse(request.body);
    const user = await this.userService.create(validatedInput);

    response.status(201).json({ id: user.id, username: user.username, email: user.email });
  };

  getById = async (request: Request, response: Response) => {
    const validatedInput = getUserByIdValidator.parse(request.params);
    const user = await this.userService.getById(validatedInput);

    response.json({ id: user.id, username: user.username, email: user.email });
  };
}

export default UserController;
