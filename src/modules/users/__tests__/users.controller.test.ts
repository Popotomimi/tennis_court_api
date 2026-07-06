import { Request, Response, NextFunction } from 'express';
import { usersController } from '../users.controller';
import { usersService } from '../users.service';
import * as updateProfileDto from '../dto/update-profile.dto';
import * as changePasswordDto from '../dto/change-password.dto';

jest.mock('../users.service');

const MockService = usersService as jest.Mocked<typeof usersService>;

function mockReq(overrides: Record<string, any> = {}): Partial<Request> {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: 'user-1', email: 'user@teste.com' },
    file: undefined,
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

const fakeUser = { id: 'user-1', name: 'João', email: 'joao@teste.com', avatar: null };

describe('UsersController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('deve retornar perfil', async () => {
      const req = mockReq() as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.getProfile.mockResolvedValue(fakeUser as any);

      await usersController.getMe(req, res, next);

      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });
  });

  describe('updateMe', () => {
    it('deve atualizar perfil', async () => {
      const req = mockReq({ body: { name: 'João Silva' } }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(updateProfileDto.updateProfileSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { name: 'João Silva' },
      } as any);

      MockService.updateProfile.mockResolvedValue({ ...fakeUser, name: 'João Silva' } as any);

      await usersController.updateMe(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'João Silva' }),
      );
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha', async () => {
      const req = mockReq({
        body: { currentPassword: 'old', newPassword: 'new123' },
      }) as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      jest.spyOn(changePasswordDto.changePasswordSchema, 'safeParse').mockReturnValue({
        success: true,
        data: { currentPassword: 'old', newPassword: 'new123' },
      } as any);

      MockService.changePassword.mockResolvedValue(fakeUser as any);

      await usersController.changePassword(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Senha alterada com sucesso' }),
      );
    });
  });

  describe('uploadAvatar', () => {
    it('deve fazer upload de avatar', async () => {
      const req = mockReq({
        file: { filename: 'avatar.jpg' },
      }) as any;
      const res = mockRes() as Response;
      const next = mockNext();

      MockService.updateAvatar.mockResolvedValue({ ...fakeUser, avatar: '/uploads/avatar.jpg' } as any);

      await usersController.uploadAvatar(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Avatar atualizado com sucesso' }),
      );
    });

    it('deve rejeitar se nenhum arquivo enviado', async () => {
      const req = mockReq() as Request;
      const res = mockRes() as Response;
      const next = mockNext();

      await usersController.uploadAvatar(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, message: 'Nenhum arquivo enviado' }),
      );
    });
  });
});
