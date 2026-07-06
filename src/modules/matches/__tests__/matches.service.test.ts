import { matchesService } from '../matches.service';
import { matchesRepository } from '../matches.repository';
import { tournamentsRepository } from '../../tournaments/tournaments.repository';
import { participantsRepository } from '../../participants/participants.repository';

jest.mock('../matches.repository');
jest.mock('../../tournaments/tournaments.repository');
jest.mock('../../participants/participants.repository');

const MockMatchRepo = matchesRepository as jest.Mocked<typeof matchesRepository>;
const MockTournRepo = tournamentsRepository as jest.Mocked<typeof tournamentsRepository>;
const MockPartRepo = participantsRepository as jest.Mocked<typeof participantsRepository>;

const fakeTournament = {
  id: 't-1',
  ownerId: 'owner-1',
  name: 'Torneio',
  status: 'WAITING' as const,
  owner: { id: 'owner-1' },
};

const fakeMatch = {
  id: 'm-1',
  tournamentId: 't-1',
  round: 1,
  status: 'PENDING' as const,
  playerOneId: 'p1',
  playerTwoId: 'p2',
  playerOne: { id: 'p1', name: 'Jog1' },
  playerTwo: { id: 'p2', name: 'Jog2' },
  tournament: { id: 't-1', ownerId: 'owner-1' },
  winnerId: null,
};

describe('MatchesService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('startTournament', () => {
    it('deve iniciar torneio com sucesso', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findUserIdsByTournament.mockResolvedValue([
        { userId: 'p1' },
        { userId: 'p2' },
        { userId: 'p3' },
        { userId: 'p4' },
      ] as any);
      MockMatchRepo.createMany.mockResolvedValue([] as any);
      MockTournRepo.updateStatus.mockResolvedValue({} as any);

      const result = await matchesService.startTournament('t-1', 'owner-1');
      expect(result.message).toBe('Torneio iniciado com sucesso');
      expect(result.matches).toHaveLength(2);
      expect(MockTournRepo.updateStatus).toHaveBeenCalledWith('t-1', 'STARTED');
    });

    it('deve rejeitar se torneio nao existir', async () => {
      MockTournRepo.findById.mockResolvedValue(null);

      await expect(
        matchesService.startTournament('x', 'user-1'),
      ).rejects.toThrow('Torneio não encontrado');
    });

    it('deve rejeitar se nao for dono', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);

      await expect(
        matchesService.startTournament('t-1', 'outro'),
      ).rejects.toThrow('Apenas o dono pode iniciar o torneio');
    });

    it('deve rejeitar se torneio nao estiver WAITING', async () => {
      MockTournRepo.findById.mockResolvedValue({
        ...fakeTournament,
        status: 'STARTED',
      } as any);

      await expect(
        matchesService.startTournament('t-1', 'owner-1'),
      ).rejects.toThrow('Torneio já foi iniciado ou finalizado');
    });

    it('deve rejeitar se tiver menos de 2 participantes', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockPartRepo.findUserIdsByTournament.mockResolvedValue([] as any);

      await expect(
        matchesService.startTournament('t-1', 'owner-1'),
      ).rejects.toThrow('Mínimo de 2 participantes para iniciar o torneio');
    });
  });

  describe('listMatches', () => {
    it('deve listar partidas do torneio', async () => {
      MockTournRepo.findById.mockResolvedValue(fakeTournament as any);
      MockMatchRepo.findAllByTournament.mockResolvedValue([fakeMatch] as any);

      const result = await matchesService.listMatches('t-1');
      expect(result.matches).toHaveLength(1);
    });

    it('deve rejeitar se torneio nao existir', async () => {
      MockTournRepo.findById.mockResolvedValue(null);

      await expect(matchesService.listMatches('x')).rejects.toThrow('Torneio não encontrado');
    });
  });

  describe('registerResult', () => {
    it('deve registrar resultado e avancar vencedor', async () => {
      MockMatchRepo.findById.mockResolvedValue(fakeMatch as any);
      MockMatchRepo.updateResult.mockResolvedValue({} as any);
      MockMatchRepo.findByRound.mockResolvedValue([
        { id: 'm-1' },
        { id: 'm-2' },
      ] as any);
      MockMatchRepo.create.mockResolvedValue({} as any);
      MockMatchRepo.countPendingByTournament.mockResolvedValue(1);

      await matchesService.registerResult('m-1', 'p1', 'owner-1');
      expect(MockMatchRepo.updateResult).toHaveBeenCalledWith('m-1', 'p1');
    });

    it('deve rejeitar partida inexistente', async () => {
      MockMatchRepo.findById.mockResolvedValue(null);

      await expect(
        matchesService.registerResult('x', 'p1', 'owner-1'),
      ).rejects.toThrow('Partida não encontrada');
    });

    it('deve rejeitar se nao for dono do torneio', async () => {
      MockMatchRepo.findById.mockResolvedValue(fakeMatch as any);

      await expect(
        matchesService.registerResult('m-1', 'p1', 'outro'),
      ).rejects.toThrow('Apenas o dono do torneio pode registrar resultado');
    });

    it('deve rejeitar partida ja finalizada', async () => {
      MockMatchRepo.findById.mockResolvedValue({
        ...fakeMatch,
        status: 'FINISHED',
      } as any);

      await expect(
        matchesService.registerResult('m-1', 'p1', 'owner-1'),
      ).rejects.toThrow('Partida já foi finalizada');
    });

    it('deve rejeitar vencedor invalido', async () => {
      MockMatchRepo.findById.mockResolvedValue(fakeMatch as any);

      await expect(
        matchesService.registerResult('m-1', 'invasor', 'owner-1'),
      ).rejects.toThrow('Vencedor deve ser um dos jogadores da partida');
    });

    it('deve finalizar torneio quando ultima partida', async () => {
      MockMatchRepo.findById.mockResolvedValue(fakeMatch as any);
      MockMatchRepo.updateResult.mockResolvedValue({} as any);
      MockMatchRepo.findByRound.mockResolvedValue([{ id: 'm-1' }] as any);
      MockMatchRepo.countPendingByTournament.mockResolvedValue(0);

      await matchesService.registerResult('m-1', 'p1', 'owner-1');
      expect(MockTournRepo.updateStatus).toHaveBeenCalledWith('t-1', 'FINISHED');
      expect(MockMatchRepo.createHistory).toHaveBeenCalledWith('t-1', 'p1');
    });
  });
});
