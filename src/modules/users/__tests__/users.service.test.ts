import bcrypt from 'bcryptjs';
import { usersService } from '../users.service';
import { usersRepository } from '../users.repository';

jest.mock('../users.repository');
jest.mock('bcryptjs');

const mockBcrypt = jest.mocked(bcrypt);
const MockRepo = usersRepository as jest.Mocked<typeof usersRepository>;

const fakeUser = {
  id: 'user-1',
  name: 'João',
  email: 'joao@teste.com',
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBcrypt.hash.mockResolvedValue('hashed-password' as never);
    mockBcrypt.compare.mockResolvedValue(true as never);
  });

  describe('getProfile', () => {
    it('deve retornar perfil do usuario', async () => {
      MockRepo.findById.mockResolvedValue(fakeUser);

      const result = await usersService.getProfile('user-1');
      expect(result.name).toBe('João');
    });

    it('deve lancar 404 se usuario nao existir', async () => {
      MockRepo.findById.mockResolvedValue(null);

      await expect(usersService.getProfile('x')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('updateProfile', () => {
    it('deve atualizar nome do usuario', async () => {
      MockRepo.findById.mockResolvedValue(fakeUser);
      MockRepo.update.mockResolvedValue({ ...fakeUser, name: 'João Silva' });

      const result = await usersService.updateProfile('user-1', { name: 'João Silva' });
      expect(result.name).toBe('João Silva');
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com sucesso', async () => {
      MockRepo.findByIdWithPassword.mockResolvedValue({
        ...fakeUser,
        password: 'old-hash',
      } as any);
      MockRepo.updatePassword.mockResolvedValue({} as any);
      mockBcrypt.compare.mockResolvedValueOnce(true as never);
      mockBcrypt.compare.mockResolvedValueOnce(false as never);
      mockBcrypt.hash.mockResolvedValue('new-hash' as never);

      const result = await usersService.changePassword('user-1', {
        currentPassword: 'old',
        newPassword: 'newpass123',
      });
      expect(result).toBeDefined();
      expect(MockRepo.updatePassword).toHaveBeenCalledWith('user-1', 'new-hash');
    });

    it('deve rejeitar senha atual incorreta', async () => {
      MockRepo.findByIdWithPassword.mockResolvedValue({
        ...fakeUser,
        password: 'old-hash',
      } as any);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        usersService.changePassword('user-1', {
          currentPassword: 'wrong',
          newPassword: 'newpass123',
        }),
      ).rejects.toThrow('Senha atual incorreta');
    });
  });

  describe('updateAvatar', () => {
    it('deve atualizar avatar', async () => {
      MockRepo.findById.mockResolvedValue(fakeUser);
      MockRepo.update.mockResolvedValue({ ...fakeUser, avatar: '/uploads/avatar.jpg' });

      const result = await usersService.updateAvatar('user-1', '/uploads/avatar.jpg');
      expect(result).toBeDefined();
    });
  });
});
