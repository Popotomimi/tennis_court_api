import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from '../auth.service';
import { authRepository } from '../auth.repository';

jest.mock('../auth.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockBcrypt = jest.mocked(bcrypt);
const mockJwt = jest.mocked(jwt);
const MockRepository = authRepository as jest.Mocked<typeof authRepository>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBcrypt.hash.mockResolvedValue('hashed-password' as never);
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockJwt.sign.mockReturnValue('fake-jwt-token' as never);
  });

  describe('register', () => {
    it('deve cadastrar usuario com sucesso', async () => {
      MockRepository.findByEmail.mockResolvedValue(null);
      MockRepository.create.mockResolvedValue({
        id: 'user-1',
        name: 'João',
        email: 'joao@teste.com',
        createdAt: new Date(),
      });

      const result = await authService.register({
        name: 'João',
        email: 'joao@teste.com',
        password: '123456',
      });

      expect(result.user.name).toBe('João');
      expect(result.token).toBe('fake-jwt-token');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('deve rejeitar email duplicado', async () => {
      MockRepository.findByEmail.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        authService.register({
          name: 'João',
          email: 'joao@teste.com',
          password: '123456',
        }),
      ).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      MockRepository.findByEmail.mockResolvedValue({
        id: 'user-1',
        name: 'João',
        email: 'joao@teste.com',
        password: 'hashed-password',
      } as any);

      const result = await authService.login({
        email: 'joao@teste.com',
        password: '123456',
      });

      expect(result.token).toBe('fake-jwt-token');
      expect(result.user.email).toBe('joao@teste.com');
    });

    it('deve rejeitar email inexistente', async () => {
      MockRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'x@x.com', password: '123456' }),
      ).rejects.toThrow('Email ou senha incorretos');
    });

    it('deve rejeitar senha incorreta', async () => {
      MockRepository.findByEmail.mockResolvedValue({
        id: 'user-1',
        password: 'hashed-password',
      } as any);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login({ email: 'joao@teste.com', password: 'wrong' }),
      ).rejects.toThrow('Email ou senha incorretos');
    });
  });
});
