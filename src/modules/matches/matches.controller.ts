import { Request, Response, NextFunction } from 'express';
import { matchesService } from './matches.service';
import { AppError } from '../../shared/errors/AppError';

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

  async listMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      const result = await matchesService.listMatches(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async registerResult(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const { winnerId } = req.body;

      if (!winnerId || typeof winnerId !== 'string') {
        throw new AppError('winnerId é obrigatório', 400);
      }

      const result = await matchesService.registerResult(id, winnerId, userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
