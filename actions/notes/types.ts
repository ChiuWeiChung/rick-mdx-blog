import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

const noteSchema = z.object({
  id: z.number(),
  title: z.string(),
  filePath: z.string(),
  coverPath: z.string(),
  author: z.string(),
  category: z.string(),
  visible: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()),
});

type Note = z.infer<typeof noteSchema>;
const NoteKeys = noteSchema.keyof().enum;
const defaultNoteValues = getDefaultValues(noteSchema);

export { noteSchema, NoteKeys, defaultNoteValues, type Note };
