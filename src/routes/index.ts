import { Router } from 'express';

const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export { routes };
