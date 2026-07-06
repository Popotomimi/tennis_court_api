import { Request, Response, NextFunction } from 'express';
import { participantsService } from './participants.service';

export const participantsController = {
  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const tournament = await participantsService.join(id, userId);

      res.status(201).json(tournament);
    } catch (error) {
      next(error);
    }
  },

  async leave(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      await participantsService.leave(id, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async listParticipants(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      const result = await participantsService.listParticipants(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
