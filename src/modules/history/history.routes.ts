import { Router } from 'express';
import { historyController } from './history.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const historyRoutes = Router();

/**
 * @openapi
 * /history:
 *   get:
 *     tags:
 *       - Histórico
 *     summary: Listar torneios finalizados do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista paginada de torneios finalizados (participou ou criou)
 *       401:
 *         description: Não autenticado
 */
historyRoutes.get('/', authMiddleware, historyController.findAll);

/**
 * @openapi
 * /history/{id}:
 *   get:
 *     tags:
 *       - Histórico
 *     summary: Detalhes de um torneio finalizado do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro de histórico
 *     responses:
 *       200:
 *         description: Detalhes completos do torneio finalizado
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Histórico não encontrado
 */
historyRoutes.get('/:id', authMiddleware, historyController.findById);

export { historyRoutes };
