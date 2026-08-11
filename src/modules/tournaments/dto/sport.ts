import { z } from 'zod/v4';

export const SPORTS = ['TENNIS', 'BEACH_TENNIS', 'PICKLEBALL'] as const;

export const sportSchema = z.enum(SPORTS);

export type Sport = z.infer<typeof sportSchema>;
