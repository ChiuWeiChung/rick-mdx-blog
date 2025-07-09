import { NoteQuerySort, QueryOrder } from '@/enums/query';
import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

/** 筆記的 response schema */
const noteSchema = z.object({
  id: z.number(),
  title: z.string().min(1, '請輸入文章標題'),
  filePath: z.string(),
  username: z.string(),
  category: z.string().min(1, '請選擇分類'),
  visible: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string(), '請提供標籤').min(1, '請選擇標籤'),
});

/** 筆記的 response type */
type Note = z.infer<typeof noteSchema>;

/** 筆記的 key */
const NoteKeys = noteSchema.keyof().enum;

/** 新增筆記的 request schema */
const createNoteSchema = noteSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    filePath: true,
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

/** 新增筆記的 request type */
type CreateNoteRequest = z.infer<typeof createNoteSchema>;

/** 新增筆記的 request schema 的 key */
const createNoteSchemaKeys = createNoteSchema.keyof().enum;

/** 新增筆記的 request schema 的預設值 */
const defaultCreateNoteValues = getDefaultValues(createNoteSchema);

/** 搜尋筆記的 request schema */
const queryNoteSchema = z
  .object({
    title: z.string().default(''),
    visible: z.boolean().nullish(),
    category: z.number().nullish(),
    tags: z.array(z.number()).nullish(),
    startCreatedTime: z.number().nullish(),
    endCreatedTime: z.number().nullish(),
    startUpdatedTime: z.number().nullish(),
    endUpdatedTime: z.number().nullish(),
    page: z.number().nullish(),
    limit: z.number().nullish(),
    sort: z.enum(NoteQuerySort).nullish(),
    order: z.enum(QueryOrder).nullish(),
  })
  .check(ctx => {
    if (
      ctx.value.startCreatedTime &&
      ctx.value.endCreatedTime &&
      ctx.value.startCreatedTime > ctx.value.endCreatedTime
    ) {
      ctx.issues.push({
        code: 'custom',
        message: '開始時間不能大於結束時間',
        input: ctx.value.startCreatedTime,
        path: ['startCreatedTime'],
      });
    }
    if (
      ctx.value.startUpdatedTime &&
      ctx.value.endUpdatedTime &&
      ctx.value.startUpdatedTime > ctx.value.endUpdatedTime
    ) {
      ctx.issues.push({
        code: 'custom',
        message: '開始時間不能大於結束時間',
        input: ctx.value.startUpdatedTime,
        path: ['startUpdatedTime'],
      });
    }
  });

/** 搜尋筆記的 request type */
type QueryNote = z.infer<typeof queryNoteSchema>;

/** 搜尋筆訊的 request schema 的 key */
const queryNoteKeys = queryNoteSchema.keyof().enum;

/** 搜尋筆訊的 request schema 的預設值 */
const defaultQueryNoteValues = getDefaultValues(queryNoteSchema);

/** 搜尋筆訊的 request schema 的 coerce */
const coerceQueryNoteSchema = queryNoteSchema.extend({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  visible: z.preprocess(val => {
    if (typeof val === 'string') {
      return val === 'true';
    }
    return val;
  }, z.boolean().nullish()),
  category: z.coerce.number().nullish(),
  tags: z.preprocess(val => {
    if (typeof val === 'string' && val) {
      return val.split(',').map(s => parseInt(s, 10));
    }
    // 若已經是陣列就原封不動
    if (Array.isArray(val)) return val;
    return undefined;
  }, z.array(z.number()).nullish()),
  startCreatedTime: z.coerce.number().nullish(),
  endCreatedTime: z.coerce.number().nullish(),
  startUpdatedTime: z.coerce.number().nullish(),
  endUpdatedTime: z.coerce.number().nullish(),
  sort: z.enum(NoteQuerySort).nullish(),
  order: z.enum(QueryOrder).nullish(),
});

/** 更新筆訊的 request schema */
const updateNoteSchema = createNoteSchema.omit({
  file: true,
  manualUpload: true,
  visible: true,
}).extend({
  id: z.number(),
});

/** 更新筆訊的 request type */
type UpdateNoteRequest = z.infer<typeof updateNoteSchema>;

/** 筆訊的詳細資訊的 schema */
const noteDetailSchema = noteSchema
  .extend({
    title: z.string(),
    visible: z.boolean(),
    createdAt: z.date(),
    category: z.string(),
    filePath: z.string(),
    tags: z.array(z.string()),
  })

/** 筆訊的詳細資訊的 type */
type NoteDetail = z.infer<typeof noteDetailSchema>;

export {
  // 查看筆記
  type Note,
  noteSchema,
  NoteKeys,

  // 新增筆記
  type CreateNoteRequest,
  createNoteSchema,
  createNoteSchemaKeys,
  defaultCreateNoteValues, // 預設值

  // 更新筆記
  type UpdateNoteRequest,
  updateNoteSchema,

  // 搜尋筆記清單
  type QueryNote,
  queryNoteSchema, // 搜尋參數的 schema
  queryNoteKeys, // 搜尋參數的 key
  coerceQueryNoteSchema, // 將搜尋參數轉換為 QueryNote 型別
  defaultQueryNoteValues, // 預設值

  // 筆記詳細資訊
  type NoteDetail,
  noteDetailSchema,
};
