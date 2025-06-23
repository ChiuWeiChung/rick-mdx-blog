import { z } from 'zod/v4';

export const noteTagSchema = z.object({
  noteId: z.string().min(1),
  tagId: z.string().min(1),
});

export type NoteTag = z.infer<typeof noteTagSchema>;
