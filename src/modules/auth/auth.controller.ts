import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { registerSchema } from './dto/register.dto';
import { loginSchema } from './dto/login.dto';
import { AppError } from '../../shared/errors/AppError';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new AppError(firstError.message, 400);
      }

      const result = await authService.register(parsed.data);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new AppError(firstError.message, 400);
      }

      const result = await authService.login(parsed.data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
