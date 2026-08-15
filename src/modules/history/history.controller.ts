import { Request, Response, NextFunction } from 'express';
import { historyService } from './history.service';

export const historyController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));

      const result = await historyService.findAll(userId, page, limit);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const result = await historyService.findById(id, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
