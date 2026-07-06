import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../errorHandler';
import { AppError } from '../../shared/errors/AppError';

function mockRes(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('ErrorHandler', () => {
  it('deve retornar erro AppError com status code correto', () => {
    const err = new AppError('Recurso não encontrado', 404);
    const req = {} as Request;
    const res = mockRes() as Response;
    const next = jest.fn() as NextFunction;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Recurso não encontrado',
      statusCode: 404,
    });
  });

  it('deve retornar 500 para erros nao tratados', () => {
    const err = new Error('Erro inesperado');
    const req = {} as Request;
    const res = mockRes() as Response;
    const next = jest.fn() as NextFunction;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro interno do servidor',
      statusCode: 500,
    });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
