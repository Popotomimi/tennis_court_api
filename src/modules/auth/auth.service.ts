import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { AppError } from '../../shared/errors/AppError';
import { getJwtSecret, getJwtExpiresIn } from '../../shared/config';

const SALT_ROUNDS = 10;

function generateToken(user: { id: string; email: string }): string {
  return jwt.sign(
    { sub: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() } as jwt.SignOptions,
  );
}

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email já cadastrado', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await authRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  },

  async login(data: { email: string; password: string }) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  },
};
