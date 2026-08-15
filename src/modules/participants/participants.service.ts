import { participantsRepository } from './participants.repository';
import { tournamentsRepository } from '../tournaments/tournaments.repository';
import { AppError } from '../../shared/errors/AppError';

export const participantsService = {
  async join(tournamentId: string, userId: string) {
    const tournament = await tournamentsRepository.findById(tournamentId);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    if (tournament.status !== 'WAITING') {
      throw new AppError('Torneio já foi iniciado ou finalizado', 400);
    }

    const existing = await participantsRepository.findByTournamentAndUser(
      tournamentId,
      userId,
    );

    if (existing) {
      throw new AppError('Usuário já está inscrito neste torneio', 409);
    }

    const currentCount = await participantsRepository.countByTournament(tournamentId);

    if (currentCount >= tournament.maxPlayers) {
      throw new AppError('Torneio já atingiu o limite máximo de participantes', 400);
    }

    await participantsRepository.create(tournamentId, userId);

    return tournamentsRepository.findById(tournamentId);
  },

  async leave(tournamentId: string, userId: string) {
    const tournament = await tournamentsRepository.findById(tournamentId);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    if (tournament.status !== 'WAITING') {
      throw new AppError('Não é possível sair de um torneio já iniciado ou finalizado', 400);
    }

    const existing = await participantsRepository.findByTournamentAndUser(
      tournamentId,
      userId,
    );

    if (!existing) {
      throw new AppError('Usuário não está inscrito neste torneio', 404);
    }

    await participantsRepository.delete(tournamentId, userId);
  },

  async listParticipants(tournamentId: string) {
    const tournament = await tournamentsRepository.findById(tournamentId);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    const participants = await participantsRepository.findParticipantsByTournament(
      tournamentId,
    );

    return {
      tournamentId,
      tournamentName: tournament.name,
      participants: participants.map((p) => p.user),
      total: participants.length,
    };
  },
};
