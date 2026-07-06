import { prisma } from '../../shared/prisma';

export const matchesRepository = {
  async createMany(data: {
    tournamentId: string;
    playerOneId: string;
    playerTwoId: string | null;
    round: number;
  }[]) {
    for (const d of data) {
      await prisma.match.create({ data: d });
    }
  },

  create(data: {
    tournamentId: string;
    playerOneId: string;
    playerTwoId: string | null;
    round: number;
  }) {
    return prisma.match.create({ data });
  },

  findAllByTournament(tournamentId: string) {
    return prisma.match.findMany({
      where: { tournamentId },
      include: {
        playerOne: { select: { id: true, name: true, email: true } },
        playerTwo: { select: { id: true, name: true, email: true } },
        winner: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ round: 'asc' }, { createdAt: 'asc' }],
    });
  },

  findById(id: string) {
    return prisma.match.findUnique({
      where: { id },
      include: {
        tournament: {
          select: { id: true, ownerId: true, status: true },
        },
        playerOne: { select: { id: true, name: true } },
        playerTwo: { select: { id: true, name: true } },
        winner: { select: { id: true, name: true } },
      },
    });
  },

  findByRound(tournamentId: string, round: number) {
    return prisma.match.findMany({
      where: { tournamentId, round },
      orderBy: { createdAt: 'asc' },
    });
  },

  updateResult(id: string, winnerId: string) {
    return prisma.match.update({
      where: { id },
      data: { winnerId, status: 'FINISHED' },
    });
  },

  updatePlayerOne(id: string, playerOneId: string) {
    return prisma.match.update({
      where: { id },
      data: { playerOneId },
    });
  },

  updatePlayerTwo(id: string, playerTwoId: string) {
    return prisma.match.update({
      where: { id },
      data: { playerTwoId },
    });
  },

  countPendingByTournament(tournamentId: string) {
    return prisma.match.count({
      where: { tournamentId, status: 'PENDING' },
    });
  },

  createHistory(tournamentId: string, championId: string) {
    return prisma.tournamentHistory.create({
      data: { tournamentId, championId, finishedAt: new Date() },
    });
  },
};
