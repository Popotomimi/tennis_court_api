import { Request, Response, NextFunction } from 'express';
import { tournamentsService } from './tournaments.service';
import { createTournamentSchema } from './dto/create-tournament.dto';
import { updateTournamentSchema } from './dto/update-tournament.dto';
import { AppError } from '../../shared/errors/AppError';

export const tournamentsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const parsed = createTournamentSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new AppError(firstError.message, 400);
      }

      const tournament = await tournamentsService.create({
        ...parsed.data,
        ownerId: userId,
      });

      res.status(201).json(tournament);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));

      const result = await tournamentsService.findAll(page, limit);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      const tournament = await tournamentsService.findById(id);

      res.json(tournament);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const parsed = updateTournamentSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new AppError(firstError.message, 400);
      }

      const tournament = await tournamentsService.update(id, userId, parsed.data);

      res.json(tournament);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      await tournamentsService.remove(id, userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
