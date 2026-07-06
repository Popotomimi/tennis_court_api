import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../auth.middleware';

jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken');
  return {
    ...actual,
    verify: jest.fn(),
  };
});

const mockVerify = jwt.verify as jest.Mock;

function mockReq(headers: Record<string, string> = {}): Partial<Request> {
  return { headers } as any;
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

describe('AuthMiddleware', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve rejeitar se token nao fornecido', () => {
    const req = mockReq() as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token não fornecido', statusCode: 401 }),
    );
  });

  it('deve rejeitar formato invalido', () => {
    const req = mockReq({ authorization: 'InvalidFormat' }) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Formato de token inválido', statusCode: 401 }),
    );
  });

  it('deve aceitar token valido e definir req.user', () => {
    const req = mockReq({ authorization: 'Bearer valid-token' }) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    mockVerify.mockReturnValue({ sub: 'user-1', email: 'user@teste.com' });

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: 'user-1', email: 'user@teste.com' });
    expect(next).toHaveBeenCalledWith();
  });

  it('deve rejeitar token expirado', () => {
    const req = mockReq({ authorization: 'Bearer expired-token' }) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    mockVerify.mockImplementation(() => {
      throw new jwt.TokenExpiredError('jwt expired', new Date());
    });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token expirado', statusCode: 401 }),
    );
  });

  it('deve rejeitar token invalido', () => {
    const req = mockReq({ authorization: 'Bearer bad-token' }) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    mockVerify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid token');
    });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token inválido', statusCode: 401 }),
    );
  });

  it('deve retornar erro de configuracao quando JWT_SECRET nao definida', () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const req = mockReq({ authorization: 'Bearer some-token' }) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Erro de configuração do servidor', statusCode: 500 }),
    );

    process.env.JWT_SECRET = originalSecret;
  });
});
