import { prisma } from '../../shared/prisma';

export const tournamentsRepository = {
  create(data: {
    name: string;
    description?: string;
    maxPlayers: number;
    ownerId: string;
  }) {
    return prisma.tournament.create({
      data: {
        name: data.name,
        description: data.description,
        maxPlayers: data.maxPlayers,
        ownerId: data.ownerId,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    });
  },

  findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return prisma.tournament.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    });
  },

  countAll() {
    return prisma.tournament.count();
  },

  findById(id: string) {
    return prisma.tournament.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    });
  },

  updateStatus(id: string, status: 'WAITING' | 'STARTED' | 'FINISHED') {
    return prisma.tournament.update({
      where: { id },
      data: { status },
    });
  },

  update(
    id: string,
    data: { name?: string; description?: string | null; maxPlayers?: number },
  ) {
    return prisma.tournament.update({
      where: { id },
      data,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    });
  },

  delete(id: string) {
    return prisma.tournament.delete({ where: { id } });
  },
};
