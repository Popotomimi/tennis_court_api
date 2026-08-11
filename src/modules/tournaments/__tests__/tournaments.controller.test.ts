import { Request, Response, NextFunction } from 'express';
import { tournamentsController } from '../tournaments.controller';
import { tournamentsService } from '../tournaments.service';
import * as createDto from '../dto/create-tournament.dto';
import * as updateDto from '../dto/update-tournament.dto';

jest.mock('../tournaments.service');

const MockService = tournamentsService as jest.Mocked<typeof tournamentsService>;

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

const fakeTournament = {
  id: 't-1',
  name: 'Torneio',
  ownerId: 'user-1',
  sport: 'TENNIS',
  status: 'WAITING',
};

describe('TournamentsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar torneio e retornar 201', async () => {
      const req = mockReq({
        body: { name: 'Novo Torneio', maxPlayers: 8 },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(createDto.createTournamentSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { name: 'Novo Torneio', sport: 'TENNIS', maxPlayers: 8 },
      } as any);

      MockService.create.mockResolvedValue(fakeTournament as any);

      await tournamentsController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeTournament);
    });

    it('deve repassar sport para o service', async () => {
      const req = mockReq({
        body: { name: 'Novo Torneio', sport: 'PICKLEBALL', maxPlayers: 8 },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(createDto.createTournamentSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { name: 'Novo Torneio', sport: 'PICKLEBALL', maxPlayers: 8 },
      } as any);

      await tournamentsController.create(req, res, next);

      expect(MockService.create).toHaveBeenCalledWith(
        expect.objectContaining({ sport: 'PICKLEBALL', ownerId: 'user-1' }),
      );
    });

    it('deve rejeitar dados invalidos', async () => {
      const req = mockReq({ body: {} }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(createDto.createTournamentSchema, 'safeParse').mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Nome é obrigatório' }] },
      } as any);

      await tournamentsController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('deve rejeitar sport invalido', async () => {
      const req = mockReq({
        body: { name: 'Torneio', sport: 'FUTEBOL', maxPlayers: 8 },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(createDto.createTournamentSchema, 'safeParse').mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Valor inválido para sport' }] },
      } as any);

      await tournamentsController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });
  });

  describe('findAll', () => {
    it('deve listar torneios paginados', async () => {
      const req = mockReq({ query: { page: '1', limit: '10' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.findAll.mockResolvedValue({
        data: [fakeTournament],
        total: 1,
        page: 1,
        limit: 10,
      } as any);

      await tournamentsController.findAll(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: [fakeTournament], total: 1 }),
      );
    });
  });

  describe('findById', () => {
    it('deve buscar torneio por id', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.findById.mockResolvedValue(fakeTournament as any);

      await tournamentsController.findById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(fakeTournament);
    });
  });

  describe('update', () => {
    it('deve atualizar torneio', async () => {
      const req = mockReq({
        params: { id: 't-1' },
        body: { name: 'Editado' },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(updateDto.updateTournamentSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { name: 'Editado' },
      } as any);

      MockService.update.mockResolvedValue({ ...fakeTournament, name: 'Editado' } as any);

      await tournamentsController.update(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Editado' }),
      );
    });

    it('deve rejeitar dados invalidos no update', async () => {
      const req = mockReq({ params: { id: 't-1' }, body: { name: '' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(updateDto.updateTournamentSchema, 'safeParse').mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Nome inválido' }] },
      } as any);

      await tournamentsController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('deve repassar sport ao atualizar', async () => {
      const req = mockReq({
        params: { id: 't-1' },
        body: { sport: 'BEACH_TENNIS' },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(updateDto.updateTournamentSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { sport: 'BEACH_TENNIS' },
      } as any);

      MockService.update.mockResolvedValue({
        ...fakeTournament,
        sport: 'BEACH_TENNIS',
      } as any);

      await tournamentsController.update(req, res, next);

      expect(MockService.update).toHaveBeenCalledWith(
        't-1',
        'user-1',
        expect.objectContaining({ sport: 'BEACH_TENNIS' }),
      );
    });
  });

  describe('remove', () => {
    it('deve excluir torneio e retornar 204', async () => {
      const req = mockReq({ params: { id: 't-1' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.remove.mockResolvedValue(undefined as any);

      await tournamentsController.remove(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
