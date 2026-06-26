import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
