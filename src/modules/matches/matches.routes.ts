import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { matchesController } from './matches.controller';

const matchesRoutes = Router();
const matchesResultRoutes = Router();

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

/**
 * @openapi
 * /tournaments/{id}/matches:
 *   get:
 *     tags:
 *       - Confrontos
 *     summary: Listar partidas do torneio
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
 *         description: Lista de partidas ordenadas por round
 *       404:
 *         description: Torneio não encontrado
 */
matchesRoutes.get('/:id/matches', matchesController.listMatches);

/**
 * @openapi
 * /matches/{id}/result:
 *   put:
 *     tags:
 *       - Confrontos
 *     summary: Registrar vencedor de uma partida (apenas dono do torneio)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da partida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - winnerId
 *             properties:
 *               winnerId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do jogador vencedor
 *     responses:
 *       200:
 *         description: Resultado registrado e vencedor avançou
 *       400:
 *         description: Partida já finalizada ou vencedor inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas o dono do torneio pode registrar
 *       404:
 *         description: Partida não encontrada
 */
matchesResultRoutes.put('/:id/result', authMiddleware, matchesController.registerResult);

export { matchesRoutes, matchesResultRoutes };
