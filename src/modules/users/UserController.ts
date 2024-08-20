import UserService from './UserService';
import { Request, Response } from 'express';
import { getUserByIdValidator } from './validators/GetUserByIdValidator';

class UserController {
  private userService = new UserService();

  getById = async (request: Request, response: Response) => {
    const validatedInput = getUserByIdValidator.parse(request.params);
    const user = await this.userService.getById(validatedInput);

    response.json({ id: user.id, username: user.username, email: user.email });
  };
}

export default UserController;
