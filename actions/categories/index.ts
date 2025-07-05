'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Category } from './types';
import { PoolClient } from 'pg';

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
export const checkCategoryExist = async (name: string, client?: PoolClient) => {
  try {
    const queryExecutor = client || pool;
    const { rows } = await queryExecutor.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (rows.length === 0) return null;
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 新增分類 */
export const findOrCreateCategory = async (name: string, client?: PoolClient) => {
  try {
    const category = await checkCategoryExist(name, client);
    if (category) return category;

    const queryExecutor = client || pool;
    const { rows } = await queryExecutor.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
