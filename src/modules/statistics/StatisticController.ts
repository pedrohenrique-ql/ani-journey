import { Request, Response } from 'express';
import StatisticService from './StatisticService';

class StatisticController {
  private statisticService = new StatisticService();

  get = async (_request: Request, response: Response) => {
    const statistics = await this.statisticService.get();
    response.status(200).json(statistics);
  };
}

export default StatisticController;
