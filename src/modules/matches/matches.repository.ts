import { prisma } from '../../shared/prisma';

export const matchesRepository = {
  createMany(data: {
    tournamentId: string;
    playerOneId: string;
    playerTwoId: string | null;
    round: number;
  }[]) {
    return prisma.match.createMany({ data });
  },
};
