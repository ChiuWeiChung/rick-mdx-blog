import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

const noteSchema = z.object({
  id: z.number(),
  title: z.string().min(1, '請輸入文章標題'),
  filePath: z.string(),
  coverPath: z.string(),
  author: z.string(),
  category: z.string().min(1, '請選擇分類'),
  fileName: z
    .string()
    .min(1, '請提供檔案名稱')
    .regex(/^[a-zA-Z0-9_-]+$/, '檔案名稱只能包含英文、數字、底線和連字號'),
  visible: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string(), '請提供標籤').min(1, '請選擇標籤'),
});

const createNoteSchema = noteSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    filePath: true,
    coverPath: true,
    author: true,
  })
  .extend({
    file: z.instanceof(File).nullable(),
    content: z.string(),
  })
  .refine(
    data => {
      const criteria = data.file || data.content;
      return criteria;
    },
    {
      path: ['needFileOrContent'],
      message: '請提供檔案或內容',
    }
  );

type Note = z.infer<typeof noteSchema>;
type CreateNote = z.infer<typeof createNoteSchema>;
const NoteKeys = noteSchema.keyof().enum;
const createNoteSchemaKeys = createNoteSchema.keyof().enum;
const defaultNoteValues = getDefaultValues(createNoteSchema);

export {
  noteSchema,
  createNoteSchema,
  createNoteSchemaKeys,
  NoteKeys,
  defaultNoteValues,
  type Note,
  type CreateNote,
};
