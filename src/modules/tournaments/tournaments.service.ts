import { tournamentsRepository } from './tournaments.repository';
import { AppError } from '../../shared/errors/AppError';

export const tournamentsService = {
  async create(data: {
    name: string;
    description?: string;
    sport: 'TENNIS' | 'BEACH_TENNIS' | 'PICKLEBALL';
    maxPlayers: number;
    ownerId: string;
  }) {
    return tournamentsRepository.create(data);
  },

  async findAll(page: number, limit: number) {
    const data = await tournamentsRepository.findAll(page, limit);
    const total = await tournamentsRepository.countAll();

    return { data, total, page, limit };
  },

  async findById(id: string) {
    const tournament = await tournamentsRepository.findById(id);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    return tournament;
  },

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string | null;
      sport?: 'TENNIS' | 'BEACH_TENNIS' | 'PICKLEBALL';
      maxPlayers?: number;
    },
  ) {
    const tournament = await tournamentsRepository.findById(id);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    if (tournament.owner.id !== userId) {
      throw new AppError('Apenas o dono pode editar o torneio', 403);
    }

    if (tournament.status !== 'WAITING') {
      throw new AppError('Não é possível editar um torneio já iniciado ou finalizado', 400);
    }

    return tournamentsRepository.update(id, data);
  },

  async remove(id: string, userId: string) {
    const tournament = await tournamentsRepository.findById(id);

    if (!tournament) {
      throw new AppError('Torneio não encontrado', 404);
    }

    if (tournament.owner.id !== userId) {
      throw new AppError('Apenas o dono pode excluir o torneio', 403);
    }

    if (tournament.status !== 'WAITING') {
      throw new AppError('Não é possível excluir um torneio já iniciado ou finalizado', 400);
    }

    await tournamentsRepository.delete(id);
  },
};
