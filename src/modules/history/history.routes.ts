import { Router } from 'express';
import { historyController } from './history.controller';

const historyRoutes = Router();

/**
 * @openapi
 * /history:
 *   get:
 *     tags:
 *       - Histórico
 *     summary: Listar torneios finalizados
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
 *         description: Lista paginada de torneios finalizados
 */
historyRoutes.get('/', historyController.findAll);

/**
 * @openapi
 * /history/{id}:
 *   get:
 *     tags:
 *       - Histórico
 *     summary: Detalhes de um torneio finalizado
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
 *       404:
 *         description: Histórico não encontrado
 */
historyRoutes.get('/:id', historyController.findById);

export { historyRoutes };
