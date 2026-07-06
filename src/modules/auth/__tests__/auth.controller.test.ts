import { Request, Response, NextFunction } from 'express';
import { authController } from '../auth.controller';
import { authService } from '../auth.service';
import * as registerDto from '../dto/register.dto';
import * as loginDto from '../dto/login.dto';

jest.mock('../auth.service');

const MockService = authService as jest.Mocked<typeof authService>;

function mockReq(body: Record<string, unknown> = {}): Partial<Request> {
  return { body };
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

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar e retornar 201', async () => {
      const req = mockReq({ name: 'João', email: 'joao@teste.com', password: '123456' }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(registerDto.registerSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { name: 'João', email: 'joao@teste.com', password: '123456' },
      } as any);

      MockService.register.mockResolvedValue({
        user: { id: 'u-1', name: 'João', email: 'joao@teste.com' },
        token: 'token',
      } as any);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'token' }),
      );
    });

    it('deve rejeitar dados invalidos com 400', async () => {
      const req = mockReq({ name: '' }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(registerDto.registerSchema, 'safeParse').mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Nome é obrigatório' }] },
      } as any);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });
  });

  describe('login', () => {
    it('deve logar e retornar 200', async () => {
      const req = mockReq({ email: 'joao@teste.com', password: '123456' }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(loginDto.loginSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { email: 'joao@teste.com', password: '123456' },
      } as any);

      MockService.login.mockResolvedValue({
        user: { id: 'u-1', name: 'João', email: 'joao@teste.com' },
        token: 'token',
      } as any);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'token' }),
      );
    });

    it('deve rejeitar dados invalidos no login', async () => {
      const req = mockReq({ email: '' }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(loginDto.loginSchema, 'safeParse').mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Email inválido' }] },
      } as any);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });
  });
});
