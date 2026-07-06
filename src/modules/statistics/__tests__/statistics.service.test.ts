import { statisticsService } from '../statistics.service';
import { statisticsRepository } from '../statistics.repository';

jest.mock('../statistics.repository');

const MockRepo = statisticsRepository as jest.Mocked<typeof statisticsRepository>;

describe('StatisticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatistics', () => {
    it('deve retornar estatisticas do usuario', async () => {
      MockRepo.countTournamentsPlayed.mockResolvedValue(5);
      MockRepo.countTournamentsWon.mockResolvedValue(2);
      MockRepo.countMatchesPlayed.mockResolvedValue(10);
      MockRepo.countMatchesWon.mockResolvedValue(7);

      const result = await statisticsService.getStatistics('user-1');

      expect(result.tournamentsPlayed).toBe(5);
      expect(result.tournamentsWon).toBe(2);
      expect(result.matchesPlayed).toBe(10);
      expect(result.matchesWon).toBe(7);
      expect(result.winRate).toBe(70);
    });

    it('deve retornar winRate 0 quando nenhuma partida', async () => {
      MockRepo.countTournamentsPlayed.mockResolvedValue(0);
      MockRepo.countTournamentsWon.mockResolvedValue(0);
      MockRepo.countMatchesPlayed.mockResolvedValue(0);
      MockRepo.countMatchesWon.mockResolvedValue(0);

      const result = await statisticsService.getStatistics('user-1');

      expect(result.winRate).toBe(0);
    });

    it('deve calcular winRate com 1 casa decimal', async () => {
      MockRepo.countTournamentsPlayed.mockResolvedValue(3);
      MockRepo.countTournamentsWon.mockResolvedValue(1);
      MockRepo.countMatchesPlayed.mockResolvedValue(7);
      MockRepo.countMatchesWon.mockResolvedValue(3);

      const result = await statisticsService.getStatistics('user-1');

      expect(result.winRate).toBe(42.9);
    });
  });
});
