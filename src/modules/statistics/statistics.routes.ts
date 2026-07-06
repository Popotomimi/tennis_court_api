import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { statisticsController } from './statistics.controller';

const statisticsRoutes = Router();

/**
 * @openapi
 * /statistics/me:
 *   get:
 *     tags:
 *       - Estatísticas
 *     summary: Retorna estatísticas do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tournamentsPlayed:
 *                   type: integer
 *                   example: 10
 *                 tournamentsWon:
 *                   type: integer
 *                   example: 3
 *                 matchesPlayed:
 *                   type: integer
 *                   example: 42
 *                 matchesWon:
 *                   type: integer
 *                   example: 30
 *                 winRate:
 *                   type: number
 *                   example: 71.4
 *       401:
 *         description: Não autenticado
 */
statisticsRoutes.get('/me', authMiddleware, statisticsController.getMe);

export { statisticsRoutes };
