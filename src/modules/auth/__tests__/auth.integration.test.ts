import request from 'supertest';
import { app } from '../../../app';
import { authService } from '../../auth/auth.service';

jest.mock('../../auth/auth.service');

const MockService = authService as jest.Mocked<typeof authService>;

describe('POST /api/auth/register - Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar usuario com sucesso', async () => {
    MockService.register.mockResolvedValue({
      user: { id: 'u-1', name: 'João', email: 'joao@teste.com' },
      token: 'fake-token',
    } as any);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'João', email: 'joao@teste.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.name).toBe('João');
  });

  it('deve retornar 400 para dados invalidos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: '', email: 'invalido', password: '12' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login - Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve logar com sucesso', async () => {
    MockService.login.mockResolvedValue({
      user: { id: 'u-1', name: 'João', email: 'joao@teste.com' },
      token: 'fake-token',
    } as any);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@teste.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('deve retornar 400 para dados invalidos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
