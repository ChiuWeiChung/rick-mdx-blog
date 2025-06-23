import { z } from 'zod/v4';

export const tagSchema = z.object({
  name: z.string().min(1),
  id: z.number(),
});

export type Tag = z.infer<typeof tagSchema>;
