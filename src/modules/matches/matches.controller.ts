import { Request, Response, NextFunction } from 'express';
import { matchesService } from './matches.service';

export const matchesController = {
  async startTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const result = await matchesService.startTournament(id, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
