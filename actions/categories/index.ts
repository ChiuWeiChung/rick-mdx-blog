'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Category } from './types';

/** 取得所有分類 */
export const getCategories = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories');
    return toCamelCase<Category>(rows);
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** 檢查分類是否存在 */
export const checkCategoryExist = async (name: string) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (rows.length === 0) return null;
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 新增分類 */
export const createCategory = async (name: string) => {
  try {
    const category = await checkCategoryExist(name);
    if (category) return category;
    const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [
      name,
    ]);
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
