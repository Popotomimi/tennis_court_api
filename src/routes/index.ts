import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { usersRoutes } from '../modules/users/users.routes';
import { tournamentsRoutes } from '../modules/tournaments/tournaments.routes';
import { participantsRoutes } from '../modules/participants/participants.routes';
import { matchesRoutes } from '../modules/matches/matches.routes';

const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

routes.use('/auth', authRoutes);
routes.use('/users', usersRoutes);
routes.use('/tournaments', tournamentsRoutes);
routes.use('/tournaments', participantsRoutes);
routes.use('/tournaments', matchesRoutes);

export { routes };
