import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { tournamentsController } from './tournaments.controller';

const tournamentsRoutes = Router();

/**
 * @openapi
 * /tournaments:
 *   post:
 *     tags:
 *       - Torneios
 *     summary: Criar um novo torneio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - maxPlayers
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               sport:
 *                 type: string
 *                 enum:
 *                   - TENNIS
 *                   - BEACH_TENNIS
 *                   - PICKLEBALL
 *                 default: TENNIS
 *                 description: Modalidade esportiva do torneio
 *               maxPlayers:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 128
 *     responses:
 *       201:
 *         description: Torneio criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 */
tournamentsRoutes.post('/', authMiddleware, tournamentsController.create);

/**
 * @openapi
 * /tournaments:
 *   get:
 *     tags:
 *       - Torneios
 *     summary: Listar todos os torneios
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de torneios paginada
 */
tournamentsRoutes.get('/', tournamentsController.findAll);

/**
 * @openapi
 * /tournaments/{id}:
 *   get:
 *     tags:
 *       - Torneios
 *     summary: Buscar torneio por ID
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
 *         description: Dados do torneio
 *       404:
 *         description: Torneio não encontrado
 */
tournamentsRoutes.get('/:id', tournamentsController.findById);

/**
 * @openapi
 * /tournaments/{id}:
 *   put:
 *     tags:
 *       - Torneios
 *     summary: Editar torneio (apenas dono)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *               sport:
 *                 type: string
 *                 enum:
 *                   - TENNIS
 *                   - BEACH_TENNIS
 *                   - PICKLEBALL
 *                 description: Modalidade esportiva do torneio
 *               maxPlayers:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 128
 *     responses:
 *       200:
 *         description: Torneio atualizado
 *       400:
 *         description: Erro de validação ou torneio já iniciado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas o dono pode editar
 *       404:
 *         description: Torneio não encontrado
 */
tournamentsRoutes.put('/:id', authMiddleware, tournamentsController.update);

/**
 * @openapi
 * /tournaments/{id}:
 *   delete:
 *     tags:
 *       - Torneios
 *     summary: Excluir torneio (apenas dono)
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
 *         description: Torneio excluído
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas o dono pode excluir
 *       404:
 *         description: Torneio não encontrado
 */
tournamentsRoutes.delete('/:id', authMiddleware, tournamentsController.remove);

export { tournamentsRoutes };
