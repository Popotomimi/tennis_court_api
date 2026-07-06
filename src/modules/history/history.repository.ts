import { prisma } from '../../shared/prisma';

export const historyRepository = {
  findAllFinished(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return prisma.tournament.findMany({
      where: { status: 'FINISHED' },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        history: {
          select: {
            id: true,
            finishedAt: true,
            champion: { select: { id: true, name: true } },
          },
        },
        _count: {
          select: { participants: true },
        },
      },
    });
  },

  countAll() {
    return prisma.tournament.count({
      where: { status: 'FINISHED' },
    });
  },

  findById(id: string) {
    return prisma.tournamentHistory.findUnique({
      where: { id },
      include: {
        tournament: {
          include: {
            owner: { select: { id: true, name: true, email: true } },
            participants: {
              include: {
                user: { select: { id: true, name: true, email: true, avatar: true } },
              },
              orderBy: { joinedAt: 'asc' },
            },
            matches: {
              include: {
                playerOne: { select: { id: true, name: true } },
                playerTwo: { select: { id: true, name: true } },
                winner: { select: { id: true, name: true } },
              },
              orderBy: [{ round: 'asc' }, { createdAt: 'asc' }],
            },
          },
        },
        champion: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },
};
