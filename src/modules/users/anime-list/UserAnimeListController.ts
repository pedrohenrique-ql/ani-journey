import UserAnimeListService from './UserAnimeListService';
import { Request, Response } from 'express';
import { addAnimeToUserListValidator } from './validators/addAnimeToUserListValidator';
import { getUserAnimeListValidator } from './validators/getUserAnimeListValidator';
import { toUserAnimeListResponse } from './toResponse';

class UserAnimeListController {
  private userAnimeListService = new UserAnimeListService();

  add = async (request: Request, response: Response) => {
    const validatedInput = addAnimeToUserListValidator.parse({ ...request.params, ...request.body });
    const { animeId } = await this.userAnimeListService.addAnimeToUserList(validatedInput);

    response.status(201).json({ message: `Anime ${animeId} added to user list.` });
  };

  getAll = async (request: Request, response: Response) => {
    const validatedInput = getUserAnimeListValidator.parse({ ...request.params, ...request.body, ...request.query });
    const { animeList, total } = await this.userAnimeListService.getAll(validatedInput);

    const userAnimeListResponse = toUserAnimeListResponse(validatedInput.userId, animeList, {
      page: validatedInput.page,
      total,
    });
    response.status(200).json(userAnimeListResponse);
  };

  remove = async (request: Request, response: Response) => {
    const validatedInput = addAnimeToUserListValidator.parse({ ...request.params, ...request.body });
    await this.userAnimeListService.remove(validatedInput);

    response.status(204).send();
  };
}

export default UserAnimeListController;
