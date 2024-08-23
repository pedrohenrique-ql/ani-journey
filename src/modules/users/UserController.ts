import UserService from './UserService';
import { Request, Response } from 'express';
import { getUserValidator } from './validators/GetUserValidator';
import { createUserValidator } from './validators/CreateUserValidator';
import { updateUserValidator } from './validators/UpdateUserValidator';
import { deleteUserValidator } from './validators/DeleteUserValidator';

class UserController {
  private userService = new UserService();

  create = async (request: Request, response: Response) => {
    const validatedInput = createUserValidator.parse(request.body);
    const user = await this.userService.create(validatedInput);

    response.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  };

  getById = async (request: Request, response: Response) => {
    const validatedInput = getUserValidator.parse(request.params);
    const user = await this.userService.getById(validatedInput);

    response.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  };

  update = async (request: Request, response: Response) => {
    const validatedInput = updateUserValidator.parse({ ...request.params, ...request.body });
    const user = await this.userService.update(validatedInput);

    response.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  };

  delete = async (request: Request, response: Response) => {
    const validatedInput = deleteUserValidator.parse(request.params);
    await this.userService.delete(validatedInput);

    response.status(204).end();
  };
}

export default UserController;
