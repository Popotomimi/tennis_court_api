import { Request, Response, NextFunction } from 'express';
import { statisticsService } from './statistics.service';

export const statisticsController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const stats = await statisticsService.getStatistics(userId);

      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
};
