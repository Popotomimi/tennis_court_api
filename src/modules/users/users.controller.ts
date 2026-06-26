import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { updateProfileSchema } from './dto/update-profile.dto';
import { changePasswordSchema } from './dto/change-password.dto';
import { AppError } from '../../shared/errors/AppError';

export const usersController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await usersService.getProfile(userId);

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new AppError(firstError.message, 400);
      }

      const user = await usersService.updateProfile(userId, parsed.data);

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new AppError(firstError.message, 400);
      }

      const user = await usersService.changePassword(userId, parsed.data);

      res.json({ message: 'Senha alterada com sucesso', user });
    } catch (error) {
      next(error);
    }
  },

  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      if (!req.file) {
        throw new AppError('Nenhum arquivo enviado', 400);
      }

      const avatarPath = `/uploads/${req.file.filename}`;
      const user = await usersService.updateAvatar(userId, avatarPath);

      res.json({ message: 'Avatar atualizado com sucesso', user });
    } catch (error) {
      next(error);
    }
  },
};
