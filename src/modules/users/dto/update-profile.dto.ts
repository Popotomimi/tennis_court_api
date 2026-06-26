import { z } from 'zod/v4';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
