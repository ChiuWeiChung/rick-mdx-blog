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

export const toOption = (rows: { name: string; id: number }[]): Option<number>[] => {
  return rows.map(({ name, id }) => {
    return {
      label: String(name),
      value: id,
    };
  });
};
