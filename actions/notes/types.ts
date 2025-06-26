import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

const noteSchema = z.object({
  id: z.number(),
  title: z.string().min(1, '請輸入文章標題'),
  filePath: z.string(),
  coverPath: z.string(),
  username: z.string(),
  category: z.string().min(1, '請選擇分類'),
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
    username: true,
  })
  .extend({
    file: z.instanceof(File).nullable(),
    content: z.string(),
    manualUpload: z.boolean(),
    fileName: z
      .string()
      .min(1, '請提供檔案名稱')
      .regex(/^[a-zA-Z0-9_-]+$/, '檔案名稱只能包含英文、數字、底線和連字號'),
  })
  .check(ctx => {
    // 如果 manualUpload 為 true，則 file 則為必填
    if (ctx.value.manualUpload && !ctx.value.file) {
      // add issue to ctx
      ctx.issues.push({
        code: 'custom',
        message: '您選擇手動上傳，請提供檔案',
        input: ctx.value.manualUpload,
        path: ['file'],
      });
    }

    if (!ctx.value.manualUpload && !ctx.value.content) {
      ctx.issues.push({
        code: 'custom',
        message: '內容不能為空，請提供內容',
        input: ctx.value.content,
        path: ['content'],
      });
    }
  });
  

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
