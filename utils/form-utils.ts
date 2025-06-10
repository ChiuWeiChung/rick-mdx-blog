import * as z from 'zod';

/** 透過 zod 的 schema 提取預設值 */
export function getDefaultValues<Schema extends z.AnyZodObject>(schema: Schema): z.infer<Schema> {
	const shape = schema.shape as z.ZodRawShape; // 確保 shape 型別正確 (workaround)

	return Object.fromEntries(
		Object.entries(shape).map(([key, value]) => {
			if (value instanceof z.ZodDefault) {
				return [key, value._def.defaultValue()];
			}
			// 對於字串類型，提供空字串作為預設值
			if (value instanceof z.ZodString) {
				return [key, ''];
			}
			return [key, undefined];
		})
	) as z.infer<Schema>;
}
