import UserService from './UserService';
import { Request, Response } from 'express';
import { getUserByIdValidator } from './validators/GetUserByIdValidator';
import { createUserValidator } from './validators/CreateUserValidator';
import { updateUserValidator } from './validators/UpdateUserValidator';

class UserController {
  private userService = new UserService();

  create = async (request: Request, response: Response) => {
    const validatedInput = createUserValidator.parse(request.body);
    const user = await this.userService.create(validatedInput);

    response.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  };

  getById = async (request: Request, response: Response) => {
    const validatedInput = getUserByIdValidator.parse(request.params);
    const user = await this.userService.getById(validatedInput);

    response.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  };

  update = async (request: Request, response: Response) => {
    const validatedInput = updateUserValidator.parse({ ...request.params, ...request.body });
    const user = await this.userService.update(validatedInput);

    response.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  };
}

export default UserController;
