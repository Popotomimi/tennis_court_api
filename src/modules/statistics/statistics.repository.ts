import { prisma } from '../../shared/prisma';

export const statisticsRepository = {
  countTournamentsPlayed(userId: string) {
    return prisma.tournamentParticipant.count({
      where: { userId },
    });
  },

  countTournamentsWon(userId: string) {
    return prisma.tournamentHistory.count({
      where: { championId: userId },
    });
  },

  countMatchesPlayed(userId: string) {
    return prisma.match.count({
      where: {
        OR: [
          { playerOneId: userId },
          { playerTwoId: userId },
        ],
        status: 'FINISHED',
      },
    });
  },

  countMatchesWon(userId: string) {
    return prisma.match.count({
      where: { winnerId: userId },
    });
  },
};
