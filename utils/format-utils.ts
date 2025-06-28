import { Option } from '@/types/global';

export const toCamelCase = <T>(rows: Record<string, unknown>[]): T[] => {
  return rows.map(row => {
    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        return [camelKey, value];
      })
    ) as T;
  });
};

export const toOption = <T extends string | number | boolean>(
  rows: { name: T; id: number }[]
): Option<T>[] => {
  return rows.map(row => {
    return {
      label: String(row.name),
      value: row.name,
    };
  });
};
