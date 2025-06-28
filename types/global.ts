export interface Option<T extends string | number | boolean = string | number | boolean> {
  value: T;
  label: string;
  description?: string;
}
