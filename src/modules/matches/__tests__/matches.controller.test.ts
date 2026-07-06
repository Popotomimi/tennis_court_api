import { Request, Response, NextFunction } from 'express';
import { matchesController } from '../matches.controller';
import { matchesService } from '../matches.service';

jest.mock('../matches.service');

const MockService = matchesService as jest.Mocked<typeof matchesService>;

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
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

function mockNext(): NextFunction {
  return jest.fn();
}

describe('MatchesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startTournament', () => {
    it('deve iniciar torneio', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.startTournament.mockResolvedValue({
        message: 'Torneio iniciado com sucesso',
        matches: [],
      } as any);

      await matchesController.startTournament(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Torneio iniciado com sucesso' }),
      );
    });
  });

  describe('listMatches', () => {
    it('deve listar partidas', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.listMatches.mockResolvedValue({
        tournamentId: 't-1',
        matches: [],
      } as any);

      await matchesController.listMatches(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ tournamentId: 't-1' }),
      );
    });
  });

  describe('registerResult', () => {
    it('deve registrar resultado', async () => {
      const req = mockReq({
        params: { id: 'm-1' },
        body: { winnerId: 'p1' },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.registerResult.mockResolvedValue({ id: 'm-1', winnerId: 'p1' } as any);

      await matchesController.registerResult(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'm-1', winnerId: 'p1' }),
      );
    });

    it('deve rejeitar se winnerId nao informado', async () => {
      const req = mockReq({ params: { id: 'm-1' }, body: {} }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      await matchesController.registerResult(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, message: 'winnerId é obrigatório' }),
      );
    });
  });
});
