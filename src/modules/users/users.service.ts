import bcrypt from 'bcryptjs';
import { usersRepository } from './users.repository';
import { AppError } from '../../shared/errors/AppError';

const SALT_ROUNDS = 10;

export const usersService = {
  async getProfile(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  },

  async updateProfile(userId: string, data: { name: string }) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usersRepository.update(userId, { name: data.name });
  },

  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string },
  ) {
    const user = await usersRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Senha atual incorreta', 401);
    }

    const isSame = await bcrypt.compare(data.newPassword, user.password);
    if (isSame) {
      throw new AppError('Nova senha deve ser diferente da senha atual', 400);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

    return usersRepository.updatePassword(userId, hashedPassword);
  },

  async updateAvatar(userId: string, avatarPath: string) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usersRepository.update(userId, { avatar: avatarPath });
  },
};
