import { z } from 'zod/v4';

// 個人資料的 schema
const profileSchema = z.object({
  id: z.number(),
  profilePath: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type Profile = z.infer<typeof profileSchema>;

// upsert profile 的 request schema
const upsertProfileSchema = z.object({
  content: z.string().min(1, '內容不能為空').trim(),
});

type UpsertProfileRequest = z.infer<typeof upsertProfileSchema>;
const upsertProfileSchemaKeys = upsertProfileSchema.keyof().enum;

export {
  // 個人資料的 schema
  profileSchema,
  type Profile,

  // 新增編輯個人資料
  upsertProfileSchema,
  type UpsertProfileRequest,
  upsertProfileSchemaKeys,
};
