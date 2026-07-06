import { historyService } from '../history.service';
import { historyRepository } from '../history.repository';

jest.mock('../history.repository');

const MockRepo = historyRepository as jest.Mocked<typeof historyRepository>;

describe('HistoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve listar historico formatado', async () => {
      MockRepo.findAllFinished.mockResolvedValue([
        {
          id: 't-1',
          name: 'Torneio 1',
          history: {
            id: 'h-1',
            finishedAt: new Date('2025-01-01'),
            champion: { id: 'c-1', name: 'Campeão' },
          },
          _count: { participants: 8 },
        },
      ] as any);
      MockRepo.countAll.mockResolvedValue(1);

      const result = await historyService.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Torneio 1');
      expect(result.data[0].champion.name).toBe('Campeão');
      expect(result.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('deve buscar historico detalhado', async () => {
      MockRepo.findById.mockResolvedValue({
        id: 'h-1',
        finishedAt: new Date(),
        champion: { id: 'c-1', name: 'Campeão' },
        tournament: {
          id: 't-1',
          name: 'Torneio',
          description: 'Desc',
          maxPlayers: 8,
          status: 'FINISHED',
          owner: { id: 'o-1', name: 'Dono' },
          createdAt: new Date(),
          participants: [
            { user: { id: 'u-1', name: 'Jog1' } },
            { user: { id: 'u-2', name: 'Jog2' } },
          ],
          matches: [{ id: 'm-1', round: 1 }],
        },
      } as any);

      const result = await historyService.findById('h-1');

      expect(result.name).toBe('Torneio');
      expect(result.participants).toHaveLength(2);
      expect(result.matches).toHaveLength(1);
      expect(result.champion.name).toBe('Campeão');
    });

    it('deve lancar 404 se nao existir', async () => {
      MockRepo.findById.mockResolvedValue(null);

      await expect(historyService.findById('x')).rejects.toThrow('Histórico não encontrado');
    });
  });
});
