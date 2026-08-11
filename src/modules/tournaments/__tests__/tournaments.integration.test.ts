import request from 'supertest';
import { app } from '../../../app';
import { tournamentsService } from '../../tournaments/tournaments.service';
import { authMiddleware } from '../../../middlewares/auth.middleware';

jest.mock('../../tournaments/tournaments.service');
jest.mock('../../../middlewares/auth.middleware');

const MockService = tournamentsService as jest.Mocked<typeof tournamentsService>;
const mockAuth = authMiddleware as jest.MockedFunction<typeof authMiddleware>;

const fakeTournament = {
  id: 't-1',
  name: 'Torneio Teste',
  description: null,
  sport: 'TENNIS',
  maxPlayers: 8,
  status: 'WAITING',
  ownerId: 'user-1',
  owner: { id: 'user-1', name: 'Dono', email: 'dono@teste.com' },
  _count: { participants: 0 },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockImplementation((_req, _res, next) => {
    (_req as any).user = { id: 'user-1', email: 'user@teste.com' };
    next();
  });
});

describe('POST /api/tournaments - Integração', () => {
  it('deve criar torneio', async () => {
    MockService.create.mockResolvedValue(fakeTournament as any);

    const res = await request(app)
      .post('/api/tournaments')
      .set('Authorization', 'Bearer token')
      .send({ name: 'Torneio Teste', maxPlayers: 8 });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Torneio Teste');
  });

  it('deve aplicar sport TENNIS como default quando omitido', async () => {
    MockService.create.mockResolvedValue(fakeTournament as any);

    const res = await request(app)
      .post('/api/tournaments')
      .set('Authorization', 'Bearer token')
      .send({ name: 'Torneio Teste', maxPlayers: 8 });

    expect(res.status).toBe(201);
    expect(MockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ sport: 'TENNIS', ownerId: 'user-1' }),
    );
  });

  it('deve criar torneio com sport informado', async () => {
    MockService.create.mockResolvedValue({ ...fakeTournament, sport: 'BEACH_TENNIS' } as any);

    const res = await request(app)
      .post('/api/tournaments')
      .set('Authorization', 'Bearer token')
      .send({ name: 'Torneio Teste', sport: 'BEACH_TENNIS', maxPlayers: 8 });

    expect(res.status).toBe(201);
    expect(MockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ sport: 'BEACH_TENNIS' }),
    );
    expect(res.body.sport).toBe('BEACH_TENNIS');
  });

  it('deve retornar 400 para dados invalidos', async () => {
    const res = await request(app)
      .post('/api/tournaments')
      .set('Authorization', 'Bearer token')
      .send({ name: '' });

    expect(res.status).toBe(400);
  });

  it('deve retornar 400 para sport invalido', async () => {
    const res = await request(app)
      .post('/api/tournaments')
      .set('Authorization', 'Bearer token')
      .send({ name: 'Torneio Teste', sport: 'FUTEBOL', maxPlayers: 8 });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/tournaments - Integração', () => {
  it('deve listar torneios', async () => {
    MockService.findAll.mockResolvedValue({
      data: [fakeTournament],
      total: 1,
      page: 1,
      limit: 10,
    } as any);

    const res = await request(app)
      .get('/api/tournaments')
      .query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /api/tournaments/:id - Integração', () => {
  it('deve buscar torneio por id', async () => {
    MockService.findById.mockResolvedValue(fakeTournament as any);

    const res = await request(app)
      .get('/api/tournaments/t-1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('t-1');
    expect(res.body.sport).toBe('TENNIS');
  });
});

describe('PUT /api/tournaments/:id - Integração', () => {
  it('deve atualizar torneio', async () => {
    MockService.update.mockResolvedValue({ ...fakeTournament, name: 'Editado' } as any);

    const res = await request(app)
      .put('/api/tournaments/t-1')
      .set('Authorization', 'Bearer token')
      .send({ name: 'Editado' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Editado');
  });
});

describe('DELETE /api/tournaments/:id - Integração', () => {
  it('deve excluir torneio', async () => {
    MockService.remove.mockResolvedValue(undefined as any);

    const res = await request(app)
      .delete('/api/tournaments/t-1')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(204);
  });
});
