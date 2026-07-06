import { prisma } from '../../shared/prisma';

export const participantsRepository = {
  create(tournamentId: string, userId: string) {
    return prisma.tournamentParticipant.create({
      data: { tournamentId, userId },
    });
  },

  findByTournamentAndUser(tournamentId: string, userId: string) {
    return prisma.tournamentParticipant.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });
  },

  countByTournament(tournamentId: string) {
    return prisma.tournamentParticipant.count({ where: { tournamentId } });
  },

  findParticipantsByTournament(tournamentId: string) {
    return prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  },

  delete(tournamentId: string, userId: string) {
    return prisma.tournamentParticipant.delete({
      where: { tournamentId_userId: { tournamentId, userId } },
    });
  },
};
