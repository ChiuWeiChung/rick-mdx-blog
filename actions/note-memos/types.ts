import { NoteMemoQuerySort, QueryOrder } from '@/enums/query';
import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

/** 搜尋筆記備註的 request schema */
 const queryNoteMemoSchema = z.object({
  postId: z.string().nullish(),
  sort: z.enum(NoteMemoQuerySort).nullish(),
  order: z.enum(QueryOrder).nullish(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});
 type QueryNoteMemo = z.infer<typeof queryNoteMemoSchema>;
 const queryNoteMemoKeys = queryNoteMemoSchema.keyof().enum;
 const defaultQueryNoteMemoValues =  getDefaultValues(queryNoteMemoSchema);

/** 筆記備註的 response schema */
 const noteMemoSchema = z.object({
  id: z.number(),
  postId: z.number(),
  blockId: z.string(),
  startOffset: z.number(),
  endOffset: z.number(),
  content: z.string(),
  createdAt: z.string(),
  selectedContent: z.string().optional(),
});
 type NoteMemo = z.infer<typeof noteMemoSchema>;
 const noteMemoKeys = noteMemoSchema.keyof().enum;

/** 新增筆記備註的 request schema */
 const createNoteMemoRequest = noteMemoSchema.omit({ id: true, createdAt: true });
 type CreateNoteMemoRequest = z.infer<typeof createNoteMemoRequest>;

/** =============================== 表格 =============================== */
const tableNoteMemoSchema = noteMemoSchema.extend({ postTitle: z.string() });
type TableNoteMemo = z.infer<typeof tableNoteMemoSchema>;
const tableNoteMemoKeys = tableNoteMemoSchema.keyof().enum;


export {
  // 搜尋
  queryNoteMemoSchema,
  type QueryNoteMemo,
  queryNoteMemoKeys,
  defaultQueryNoteMemoValues,

  // 筆記備註
  noteMemoSchema,
  type NoteMemo,
  noteMemoKeys, 

  // 新增筆記備註
  createNoteMemoRequest,
  type CreateNoteMemoRequest,
  
  // 表格
  tableNoteMemoSchema,
  type TableNoteMemo,
  tableNoteMemoKeys,
};