import { prisma } from '../../shared/prisma';

function userScope(userId: string) {
  return {
    OR: [{ ownerId: userId }, { participants: { some: { userId } } }],
  };
}

export const historyRepository = {
  findFinishedByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    return prisma.tournament.findMany({
      where: {
        status: 'FINISHED',
        ...userScope(userId),
      },
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

  countByUser(userId: string) {
    return prisma.tournament.count({
      where: {
        status: 'FINISHED',
        ...userScope(userId),
      },
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
