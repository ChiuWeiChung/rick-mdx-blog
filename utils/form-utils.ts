import * as z from 'zod/v4';

/** 透過 zod 的 schema 提取預設值 */
export function getDefaultValues<Schema extends z.ZodObject<z.ZodRawShape>>(
	schema: Schema
): z.infer<Schema> {
	const shape = schema.shape;

	return Object.fromEntries(
		Object.entries(shape).map(([key, value]) => {
			if (value instanceof z.ZodDefault) {
				return [key, value._zod.def.defaultValue];
			}
			// 對於字串類型，提供空字串作為預設值
			if (value instanceof z.ZodString) {
				return [key, ''];
			}
			if (value instanceof z.ZodBoolean) {
				return [key, false];
			}
			return [key, undefined];
		})
	) as z.infer<Schema>;
}
