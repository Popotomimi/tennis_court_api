import { historyRepository } from './history.repository';
import { AppError } from '../../shared/errors/AppError';

export const historyService = {
  async findAll(userId: string, page: number, limit: number) {
    const [data, total] = await Promise.all([
      historyRepository.findFinishedByUser(userId, page, limit),
      historyRepository.countByUser(userId),
    ]);

    const formatted = data.map((t) => ({
      id: t.history!.id,
      tournamentId: t.id,
      name: t.name,
      sport: t.sport,
      finishedAt: t.history!.finishedAt,
      champion: t.history!.champion,
      totalParticipants: t._count.participants,
    }));

    return { data: formatted, total, page, limit };
  },

  async findById(id: string, userId: string) {
    const history = await historyRepository.findById(id);

    if (!history) {
      throw new AppError('Histórico não encontrado', 404);
    }

    const isOwner = history.tournament.ownerId === userId;
    const isParticipant = history.tournament.participants.some(
      (p) => p.userId === userId,
    );

    if (!isOwner && !isParticipant) {
      throw new AppError('Histórico não encontrado', 404);
    }

    return {
      id: history.id,
      tournamentId: history.tournament.id,
      name: history.tournament.name,
      description: history.tournament.description,
      sport: history.tournament.sport,
      maxPlayers: history.tournament.maxPlayers,
      status: history.tournament.status,
      owner: history.tournament.owner,
      createdAt: history.tournament.createdAt,
      finishedAt: history.finishedAt,
      champion: history.champion,
      participants: history.tournament.participants.map((p) => p.user),
      matches: history.tournament.matches,
    };
  },
};
