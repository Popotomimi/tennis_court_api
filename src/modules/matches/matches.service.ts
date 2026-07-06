import { matchesRepository } from './matches.repository';
import { tournamentsRepository } from '../tournaments/tournaments.repository';
import { participantsRepository } from '../participants/participants.repository';
import { AppError } from '../../shared/errors/AppError';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generatePairs(userIds: string[]): { playerOneId: string; playerTwoId: string | null }[] {
  const shuffled = shuffle(userIds);
  const pairs: { playerOneId: string; playerTwoId: string | null }[] = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    const playerOneId = shuffled[i];
    const playerTwoId = i + 1 < shuffled.length ? shuffled[i + 1] : null;
    pairs.push({ playerOneId, playerTwoId });
  }

  return pairs;
}

export const matchesService = {
  async startTournament(tournamentId: string, userId: string) {
    const tournament = await tournamentsRepository.findById(tournamentId);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    if (tournament.owner.id !== userId) {
      throw new AppError('Apenas o dono pode iniciar o torneio', 403);
    }

    if (tournament.status !== 'WAITING') {
      throw new AppError('Torneio já foi iniciado ou finalizado', 400);
    }

    const participants = await participantsRepository.findUserIdsByTournament(tournamentId);

    if (participants.length < 2) {
      throw new AppError('Mínimo de 2 participantes para iniciar o torneio', 400);
    }

    const userIds = participants.map((p) => p.userId);
    const pairs = generatePairs(userIds);

    const matchesData = pairs.map((pair) => ({
      tournamentId,
      playerOneId: pair.playerOneId,
      playerTwoId: pair.playerTwoId,
      round: 1,
    }));

    await matchesRepository.createMany(matchesData);
    await tournamentsRepository.updateStatus(tournamentId, 'STARTED');

    return {
      message: 'Torneio iniciado com sucesso',
      matches: matchesData.map((m) => ({
        playerOne: m.playerOneId,
        playerTwo: m.playerTwoId || 'bye',
        round: m.round,
      })),
    };
  },
};
