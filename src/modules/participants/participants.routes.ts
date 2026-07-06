import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { participantsController } from './participants.controller';

const participantsRoutes = Router();

/**
 * @openapi
 * /tournaments/{id}/join:
 *   post:
 *     tags:
 *       - Participantes
 *     summary: Inscrever usuário autenticado no torneio
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
 *       201:
 *         description: Inscrição realizada com sucesso
 *       400:
 *         description: Torneio já iniciado ou lotado
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Torneio não encontrado
 *       409:
 *         description: Usuário já inscrito
 */
participantsRoutes.post('/:id/join', authMiddleware, participantsController.join);

/**
 * @openapi
 * /tournaments/{id}/leave:
 *   delete:
 *     tags:
 *       - Participantes
 *     summary: Sair do torneio
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
 *       204:
 *         description: Inscrição removida
 *       400:
 *         description: Torneio já iniciado ou finalizado
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Torneio ou inscrição não encontrada
 */
participantsRoutes.delete('/:id/leave', authMiddleware, participantsController.leave);

/**
 * @openapi
 * /tournaments/{id}/participants:
 *   get:
 *     tags:
 *       - Participantes
 *     summary: Listar participantes do torneio
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
 *         description: Lista de participantes
 *       404:
 *         description: Torneio não encontrado
 */
participantsRoutes.get('/:id/participants', participantsController.listParticipants);

export { participantsRoutes };
