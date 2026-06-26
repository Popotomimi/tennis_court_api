import { prisma } from '../../shared/prisma';

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, createdAt: true },
    });
  },
};
