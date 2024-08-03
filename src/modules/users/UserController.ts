import UserService from './UserService';
import { Request, Response } from 'express';

class UserController {
  private userService = new UserService();

  async findById(req: Request, res: Response) {
    const id = req.params.id;

    const user = await this.userService.findById(id);
    if (user) {
      res.json({ id: user.id, username: user.username, email: user.email });
    } else {
      res.status(404).send('User not found');
    }
  }
}

export default UserController;
