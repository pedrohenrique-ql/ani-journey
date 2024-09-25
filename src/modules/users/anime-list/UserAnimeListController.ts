import UserAnimeListService from './UserAnimeListService';
import { Request, Response } from 'express';
import { addAnimeToUserListValidator } from './validators/addAnimeToListValidator';

class UserAnimeListController {
  private userAnimeListService = new UserAnimeListService();

  add = async (request: Request, response: Response) => {
    const validatedInput = addAnimeToUserListValidator.parse({ ...request.params, ...request.body });
    const { animeId } = await this.userAnimeListService.addAnimeToUserList(validatedInput);

    response.status(201).json({ message: `Anime ${animeId} added to user list.` });
  };
}

export default UserAnimeListController;
