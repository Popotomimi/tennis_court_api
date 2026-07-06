import { historyRepository } from './history.repository';
import { AppError } from '../../shared/errors/AppError';

export const historyService = {
  async findAll(page: number, limit: number) {
    const [data, total] = await Promise.all([
      historyRepository.findAllFinished(page, limit),
      historyRepository.countAll(),
    ]);

    const formatted = data.map((t) => ({
      id: t.history!.id,
      tournamentId: t.id,
      name: t.name,
      finishedAt: t.history!.finishedAt,
      champion: t.history!.champion,
      totalParticipants: t._count.participants,
    }));

    return { data: formatted, total, page, limit };
  },

  async findById(id: string) {
    const history = await historyRepository.findById(id);

    if (!history) {
      throw new AppError('Histórico não encontrado', 404);
    }

    return {
      id: history.id,
      tournamentId: history.tournament.id,
      name: history.tournament.name,
      description: history.tournament.description,
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
