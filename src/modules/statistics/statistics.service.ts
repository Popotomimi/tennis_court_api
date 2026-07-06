import { statisticsRepository } from './statistics.repository';

export const statisticsService = {
  async getStatistics(userId: string) {
    const [tournamentsPlayed, tournamentsWon, matchesPlayed, matchesWon] =
      await Promise.all([
        statisticsRepository.countTournamentsPlayed(userId),
        statisticsRepository.countTournamentsWon(userId),
        statisticsRepository.countMatchesPlayed(userId),
        statisticsRepository.countMatchesWon(userId),
      ]);

    const winRate = matchesPlayed > 0
      ? Math.round((matchesWon / matchesPlayed) * 1000) / 10
      : 0;

    return {
      tournamentsPlayed,
      tournamentsWon,
      matchesPlayed,
      matchesWon,
      winRate,
    };
  },
};
