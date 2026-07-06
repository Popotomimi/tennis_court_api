import { Request, Response, NextFunction } from 'express';
import { participantsController } from '../participants.controller';
import { participantsService } from '../participants.service';

jest.mock('../participants.service');

const MockService = participantsService as jest.Mocked<typeof participantsService>;

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

describe('ParticipantsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('join', () => {
    it('deve inscrever usuario e retornar 201', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.join.mockResolvedValue({ id: 't-1', name: 'Torneio' } as any);

      await participantsController.join(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 't-1', name: 'Torneio' });
    });
  });

  describe('leave', () => {
    it('deve remover inscricao e retornar 204', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.leave.mockResolvedValue(undefined as any);

      await participantsController.leave(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('listParticipants', () => {
    it('deve listar participantes', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.listParticipants.mockResolvedValue({
        participants: [{ user: { id: 'u-1', name: 'João' } }],
        total: 1,
      } as any);

      await participantsController.listParticipants(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ total: 1 }),
      );
    });
  });
});
