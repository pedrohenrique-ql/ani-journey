import { Request, Response } from 'express';

import UserAnimeStatusService from './UserAnimeStatusService';
import { updateUserAnimeStatusValidator } from './validators/updateUserAnimeStatusValidator';

class UserAnimeStatusController {
  private userAnimeStatusService = new UserAnimeStatusService();

  update = async (request: Request, response: Response) => {
    const validatedInput = updateUserAnimeStatusValidator.parse({ ...request.params, ...request.body });
    const userAnimeStatus = await this.userAnimeStatusService.updateUserAnimeStatus(validatedInput);

    response.status(200).json(userAnimeStatus);
  };
}

export default UserAnimeStatusController;
