import { CategoryQuerySort, QueryOrder } from '@/enums/query';
import { z } from 'zod/v4';

const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, '類別名稱不能為空').trim(),
  iconPath: z.string().nullable(),
  coverPath: z.string().nullable(),
});

type Category = z.infer<typeof categorySchema>;


/** =============================== 搜尋 =============================== */

/** 搜尋類別的 request schema */
const queryCategorySchema = z.object({
  name: z.string().default(''),
  sort: z.enum(CategoryQuerySort).nullish(),
  order: z.enum(QueryOrder).nullish(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

/** 搜尋類別的 request type */
type QueryCategory = z.infer<typeof queryCategorySchema>;

/** 搜尋類別的 request schema 的 key */
const queryCategoryKeys = queryCategorySchema.keyof().enum;


/** =============================== 表格 =============================== */
const tableCategorySchema = categorySchema.extend({ postCount: z.number() });
type TableCategory = z.infer<typeof tableCategorySchema>;
const tableCategoryKeys = tableCategorySchema.keyof().enum;


/** =============================== 新增 =============================== */

/** 新增類別的 request schema */
const createCategorySchema = categorySchema.omit({ id: true }).extend({
  coverFile: z.instanceof(File).nullable(),
  iconFile: z.instanceof(File).nullable(),
});

/** 新增類別的 request type */
type CreateCategoryRequest = z.infer<typeof createCategorySchema>;

/** 新增類別的 request schema 的 key */
const createCategoryKeys = createCategorySchema.keyof().enum;

export {
  // 類別的 schema
  categorySchema,
  type Category,

  // 搜尋類別的 request schema
  queryCategorySchema,
  type QueryCategory,
  queryCategoryKeys,

  // 類別的 table schema
  type TableCategory,
  tableCategorySchema,
  tableCategoryKeys,


  // 新增類別的 request schema
  createCategorySchema,
  type CreateCategoryRequest,
  createCategoryKeys,
};