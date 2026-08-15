import { Request, Response, NextFunction } from 'express';
import { historyController } from '../history.controller';
import { historyService } from '../history.service';

jest.mock('../history.service');

const MockService = historyService as jest.Mocked<typeof historyService>;

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

describe('HistoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve listar historico paginado', async () => {
      const req = mockReq({ query: { page: '1', limit: '10' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.findAll.mockResolvedValue({
        data: [{ id: 'h-1', name: 'Torneio' }],
        total: 1,
        page: 1,
        limit: 10,
      } as any);

      await historyController.findAll(req, res, next);

      expect(MockService.findAll).toHaveBeenCalledWith('user-1', 1, 10);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ total: 1 }),
      );
    });
  });

  describe('findById', () => {
    it('deve buscar historico por id', async () => {
      const req = mockReq({ params: { id: 'h-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.findById.mockResolvedValue({
        id: 'h-1',
        name: 'Torneio Finalizado',
      } as any);

      await historyController.findById(req, res, next);

      expect(MockService.findById).toHaveBeenCalledWith('h-1', 'user-1');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Torneio Finalizado' }),
      );
    });
  });
});
