import type { ReadonlyURLSearchParams } from 'next/navigation';
import * as z from 'zod/v4';

/** 透過 zod 的 schema 提取預設值 */
export function getDefaultValues<Schema extends z.ZodObject<z.ZodRawShape>>(
  schema: Schema
): z.infer<Schema> {
  const shape = schema.shape;

  return Object.fromEntries(
    Object.entries(shape).map(([key, value]) => {
      switch (true) {
        case value instanceof z.ZodDefault:
          return [key, value._zod.def.defaultValue];
        case value instanceof z.ZodString:
        case value instanceof z.ZodEmail:
        case value instanceof z.ZodURL:
          return [key, ''];
        case value instanceof z.ZodBoolean:
          return [key, false];
        case value instanceof z.ZodNullable:
          return [key, null];
        default:
          return [key, undefined];
      }
    })
  ) as z.infer<Schema>;
}

/**
 * 將表單數據更新到 URL 搜索參數
 * @param params - URLSearchParams 實例
 * @param values - 表單數據對象
 */
export function getUpdatedSearchParams(
  values: Record<string, unknown>,
  searchParams?: ReadonlyURLSearchParams
) {
  const params = new URLSearchParams(searchParams);
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
  });
  return params;
}
