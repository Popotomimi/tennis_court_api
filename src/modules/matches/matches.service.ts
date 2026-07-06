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

  async listMatches(tournamentId: string) {
    const tournament = await tournamentsRepository.findById(tournamentId);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    const matches = await matchesRepository.findAllByTournament(tournamentId);

    return {
      tournamentId,
      tournamentName: tournament.name,
      matches,
    };
  },

  async registerResult(matchId: string, winnerId: string, userId: string) {
    const match = await matchesRepository.findById(matchId);

    if (!match) {
      throw new AppError('Partida não encontrada', 404);
    }

    if (match.tournament.ownerId !== userId) {
      throw new AppError('Apenas o dono do torneio pode registrar resultado', 403);
    }

    if (match.status !== 'PENDING') {
      throw new AppError('Partida já foi finalizada', 400);
    }

    const validPlayers = [match.playerOne?.id];
    if (match.playerTwo) {
      validPlayers.push(match.playerTwo.id);
    }

    if (!validPlayers.includes(winnerId)) {
      throw new AppError('Vencedor deve ser um dos jogadores da partida', 400);
    }

    const tournamentId = match.tournament.id;
    const round = match.round;

    await matchesRepository.updateResult(matchId, winnerId);

    const roundMatches = await matchesRepository.findByRound(tournamentId, round);

    // Only advance if there are multiple matches in this round (not the final)
    if (roundMatches.length > 1) {
      const matchIndex = roundMatches.findIndex((m) => m.id === matchId);
      const nextRound = round + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);

      if (matchIndex % 2 === 0) {
        await matchesRepository.create({
          tournamentId,
          playerOneId: winnerId,
          playerTwoId: null,
          round: nextRound,
        });
      } else {
        const nextRoundMatches = await matchesRepository.findByRound(tournamentId, nextRound);
        const nextMatch = nextRoundMatches[nextMatchIndex];

        if (nextMatch) {
          await matchesRepository.updatePlayerTwo(nextMatch.id, winnerId);
        }
      }
    }

    const pending = await matchesRepository.countPendingByTournament(tournamentId);

    if (pending === 0) {
      await tournamentsRepository.updateStatus(tournamentId, 'FINISHED');
      await matchesRepository.createHistory(tournamentId, winnerId);
    }

    const updatedMatch = await matchesRepository.findById(matchId);

    return updatedMatch;
  },
};
