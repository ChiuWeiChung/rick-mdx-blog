export interface Option<T extends string | number = string | number> {
  value: T;
  label: string;
  description?: string;
}
