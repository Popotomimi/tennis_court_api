import { Request, Response, NextFunction } from 'express';
import { statisticsController } from '../statistics.controller';
import { statisticsService } from '../statistics.service';

jest.mock('../statistics.service');

const MockService = statisticsService as jest.Mocked<typeof statisticsService>;

function mockReq(overrides: Record<string, any> = {}): Partial<Request> {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: 'user-1', email: 'user@teste.com' },
    ...overrides,
  };
}

function mockRes(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockNext(): NextFunction {
  return jest.fn();
}

describe('StatisticsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('deve retornar estatisticas', async () => {
      const req = mockReq() as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.getStatistics.mockResolvedValue({
        tournamentsPlayed: 5,
        tournamentsWon: 2,
        matchesPlayed: 10,
        matchesWon: 7,
        winRate: 70,
      } as any);

      await statisticsController.getMe(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ tournamentsPlayed: 5, winRate: 70 }),
      );
    });
  });
});
