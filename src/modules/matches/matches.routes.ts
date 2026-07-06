import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { matchesController } from './matches.controller';

const matchesRoutes = Router();

/**
 * @openapi
 * /tournaments/{id}/start:
 *   post:
 *     tags:
 *       - Confrontos
 *     summary: Iniciar torneio e gerar chaveamento automático
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do torneio
 *     responses:
 *       200:
 *         description: Torneio iniciado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Torneio iniciado com sucesso
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       playerOne:
 *                         type: string
 *                         format: uuid
 *                       playerTwo:
 *                         type: string
 *                         format: uuid
 *                       round:
 *                         type: integer
 *       400:
 *         description: Torneio já iniciado ou mínimo de participantes não atingido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas o dono pode iniciar
 *       404:
 *         description: Torneio não encontrado
 */
matchesRoutes.post('/:id/start', authMiddleware, matchesController.startTournament);

export { matchesRoutes };
