import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

// create a simple form schema with zod
export const playgroundFormSchema = z.object({
  name: z.string().min(1, '名稱不能為空').default(''),
  email: z.email('請輸入正確的電子郵件地址').default(''),
  password: z.string().min(8, '密碼長度至少8碼').default(''),
  language: z.string().min(1, '請選擇語言').default(''),
  tags: z.array(z.number()).min(1, '請至少選擇一項').default([]),
  isPublic: z.boolean().default(false),
  image: z.instanceof(File).nullish().default(null),
  markdown: z.instanceof(File).nullish().default(null),
  date: z.number().nullish().default(null),
});

export type PlaygroundFormSchema = z.infer<typeof playgroundFormSchema>;
export const playgroundFormDefaultValues = getDefaultValues(playgroundFormSchema);
export const playgroundFormKeys = playgroundFormSchema.keyof().enum;
