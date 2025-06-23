import { z } from 'zod/v4';

export const categorySchema = z.object({
  name: z.string().min(1),
  id: z.number(),
});

export type Category = z.infer<typeof categorySchema>;
