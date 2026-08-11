import { tournamentsService } from '../tournaments.service';
import { tournamentsRepository } from '../tournaments.repository';

jest.mock('../tournaments.repository');

const MockRepo = tournamentsRepository as jest.Mocked<typeof tournamentsRepository>;

const fakeTournament = {
  id: 't-1',
  ownerId: 'owner-1',
  name: 'Meu Torneio',
  description: 'Desc',
  sport: 'TENNIS' as const,
  maxPlayers: 8,
  status: 'WAITING' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: { id: 'owner-1', name: 'Dono', email: 'dono@teste.com' },
  _count: { participants: 4 },
};

describe('TournamentsService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar torneio', async () => {
      MockRepo.create.mockResolvedValue(fakeTournament as any);

      const result = await tournamentsService.create({
        name: 'Meu Torneio',
        sport: 'TENNIS',
        maxPlayers: 8,
        ownerId: 'owner-1',
      });
      expect(result.name).toBe('Meu Torneio');
    });

    it('deve repassar sport ao repository', async () => {
      MockRepo.create.mockResolvedValue({
        ...fakeTournament,
        sport: 'PICKLEBALL' as const,
      } as any);

      await tournamentsService.create({
        name: 'Torneio Pickleball',
        sport: 'PICKLEBALL',
        maxPlayers: 8,
        ownerId: 'owner-1',
      });
      expect(MockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ sport: 'PICKLEBALL' }),
      );
    });
  });

  describe('findAll', () => {
    it('deve listar torneios paginados', async () => {
      MockRepo.findAll.mockResolvedValue([fakeTournament] as any);
      MockRepo.countAll.mockResolvedValue(1);

      const result = await tournamentsService.findAll(1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('deve buscar torneio por ID', async () => {
      MockRepo.findById.mockResolvedValue(fakeTournament as any);

      const result = await tournamentsService.findById('t-1');
      expect(result.name).toBe('Meu Torneio');
    });

    it('deve lancar 404 se nao existir', async () => {
      MockRepo.findById.mockResolvedValue(null);

      await expect(tournamentsService.findById('x')).rejects.toThrow('Torneio não encontrado');
    });
  });

  describe('update', () => {
    it('deve atualizar torneio (dono)', async () => {
      MockRepo.findById.mockResolvedValue(fakeTournament as any);
      MockRepo.update.mockResolvedValue({ ...fakeTournament, name: 'Editado' } as any);

      const result = await tournamentsService.update('t-1', 'owner-1', { name: 'Editado' });
      expect(result.name).toBe('Editado');
    });

    it('deve repassar sport ao atualizar', async () => {
      MockRepo.findById.mockResolvedValue(fakeTournament as any);
      MockRepo.update.mockResolvedValue({
        ...fakeTournament,
        sport: 'BEACH_TENNIS' as const,
      } as any);

      const result = await tournamentsService.update('t-1', 'owner-1', {
        sport: 'BEACH_TENNIS',
      });

      expect(MockRepo.update).toHaveBeenCalledWith(
        't-1',
        expect.objectContaining({ sport: 'BEACH_TENNIS' }),
      );
      expect(result).toMatchObject({ sport: 'BEACH_TENNIS' });
    });

    it('deve rejeitar se nao for dono', async () => {
      MockRepo.findById.mockResolvedValue(fakeTournament as any);

      await expect(
        tournamentsService.update('t-1', 'outro-user', { name: 'Editado' }),
      ).rejects.toThrow('Apenas o dono pode editar o torneio');
    });
  });

  describe('remove', () => {
    it('deve excluir torneio (dono)', async () => {
      MockRepo.findById.mockResolvedValue(fakeTournament as any);

      await expect(
        tournamentsService.remove('t-1', 'owner-1'),
      ).resolves.not.toThrow();
    });

    it('deve rejeitar se nao for dono', async () => {
      MockRepo.findById.mockResolvedValue(fakeTournament as any);

      await expect(
        tournamentsService.remove('t-1', 'outro-user'),
      ).rejects.toThrow('Apenas o dono pode excluir o torneio');
    });
  });
});
