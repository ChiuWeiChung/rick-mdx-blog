import { QueryOrder, TagQuerySort } from '@/enums/query';
import { z } from 'zod/v4';

const tagSchema = z.object({
  name: z.string().min(1, { message: '標籤名稱不能為空' }).trim(),
  id: z.number(),
});

type Tag = z.infer<typeof tagSchema>;


/** =============================== 搜尋 =============================== */

/** 搜尋標籤的 request schema */
const queryTagSchema = z.object({
  name: z.string().default(''),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  sort: z.enum(TagQuerySort).nullish(),
  order: z.enum(QueryOrder).nullish(),
});

/** 搜尋標籤的 request type */
type QueryTag = z.infer<typeof queryTagSchema>;

/** 搜尋標籤的 request schema 的 key */
const queryTagKeys = queryTagSchema.keyof().enum;


/** =============================== 表格 =============================== */
const tableTagSchema = tagSchema.extend({ postCount: z.number() });
type TableTag = z.infer<typeof tableTagSchema>;
const tableTagKeys = tableTagSchema.keyof().enum;

/** =============================== 新增 =============================== */
const createTagSchema = tagSchema.omit({ id: true });
type CreateTagRequest = z.infer<typeof createTagSchema>;
const createTagKeys = createTagSchema.keyof().enum;


export {
  // 標籤的 schema
  tagSchema,
  type Tag,

  // 標籤的 table schema
  type TableTag,
  tableTagSchema,
  tableTagKeys,

  // 搜尋標籤的 request schema
  queryTagSchema,
  type QueryTag,
  queryTagKeys,

  // 新增標籤的 request schema
  createTagSchema,
  type CreateTagRequest,
  createTagKeys,
};