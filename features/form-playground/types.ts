import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

// create a simple form schema with zod
export const playgroundFormSchema = z.object({
	name: z.string().min(1, '名稱不能為空'),
	email: z.email('請輸入正確的電子郵件地址'),
	password: z.string().min(8, '密碼長度至少8碼'),
	language: z.string().min(1, '請選擇語言'),
	tags: z.array(z.string()).min(1, '請選擇標籤'),
	isPublic: z.boolean(),
	image: z.instanceof(File).nullable(),
});

export type PlaygroundFormSchema = z.infer<typeof playgroundFormSchema>;
export const playgroundFormDefaultValues = getDefaultValues(playgroundFormSchema);
export const playgroundFormKeys = playgroundFormSchema.keyof().enum;
