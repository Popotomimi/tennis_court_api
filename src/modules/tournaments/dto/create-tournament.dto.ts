import { z } from 'zod/v4';

export const createTournamentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  maxPlayers: z
    .number()
    .int()
    .min(2, 'Mínimo de 2 participantes')
    .max(128, 'Máximo de 128 participantes'),
});

export type CreateTournamentDTO = z.infer<typeof createTournamentSchema>;
