import { participantsService } from '../participants.service';
import { participantsRepository } from '../participants.repository';
import { tournamentsRepository } from '../../tournaments/tournaments.repository';

jest.mock('../participants.repository');
jest.mock('../../tournaments/tournaments.repository');

const MockPartRepo = participantsRepository as jest.Mocked<typeof participantsRepository>;
const MockTournRepo = tournamentsRepository as jest.Mocked<typeof tournamentsRepository>;

const fakeTournament = {
  id: 't-1',
  ownerId: 'owner-1',
  name: 'Torneio',
  description: null,
  maxPlayers: 4,
  status: 'WAITING' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: { id: 'owner-1', name: 'Dono', email: 'dono@teste.com' },
  _count: { participants: 1 },
};

describe('ParticipantsService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('join', () => {
    it('deve inscrever usuario no torneio', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findByTournamentAndUser.mockResolvedValue(null);
      MockPartRepo.countByTournament.mockResolvedValue(1);
      MockPartRepo.create.mockResolvedValue({} as any);
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);

      const result = await participantsService.join('t-1', 'user-1');
      expect(result).toBeDefined();
    });

    it('deve rejeitar se torneio ja iniciado', async () => {
      MockTournRepo.findById.mockResolvedValue({
        ...fakeTournament,
        status: 'STARTED',
      } as any);

      await expect(
        participantsService.join('t-1', 'user-1'),
      ).rejects.toThrow('Torneio já foi iniciado ou finalizado');
    });

    it('deve rejeitar inscricao duplicada', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findByTournamentAndUser.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        participantsService.join('t-1', 'user-1'),
      ).rejects.toThrow('Usuário já está inscrito neste torneio');
    });

    it('deve rejeitar se torneio estiver lotado', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findByTournamentAndUser.mockResolvedValue(null);
      MockPartRepo.countByTournament.mockResolvedValue(4);

      await expect(
        participantsService.join('t-1', 'user-1'),
      ).rejects.toThrow('Torneio já atingiu o limite máximo de participantes');
    });
  });

  describe('leave', () => {
    it('deve remover inscricao', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findByTournamentAndUser.mockResolvedValue({ id: 'p-1' } as any);

      await expect(
        participantsService.leave('t-1', 'user-1'),
      ).resolves.not.toThrow();
    });

    it('deve rejeitar se nao estiver inscrito', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findByTournamentAndUser.mockResolvedValue(null);

      await expect(
        participantsService.leave('t-1', 'user-1'),
      ).rejects.toThrow('Usuário não está inscrito neste torneio');
    });
  });

  describe('listParticipants', () => {
    it('deve listar participantes', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findParticipantsByTournament.mockResolvedValue([
        { user: { id: 'u-1', name: 'João', email: 'joao@teste.com', avatar: null } },
      ] as any);

      const result = await participantsService.listParticipants('t-1');
      expect(result.participants).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
