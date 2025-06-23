'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Tag } from './types';

/** 取得所有標籤 */
export const getTags = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM tags');
    return toCamelCase<Tag>(rows);
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** 檢查標籤是否存在 */
export const checkTagExist = async (name: string) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tags WHERE name = $1', [name]);
    if (rows.length === 0) return null;
    return toCamelCase<Tag>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 新增標籤 */
export const createTags = async (names: string[]) => {
  try {
    const tags = await Promise.all(
      names.map(async name => {
        const tag = await checkTagExist(name);
        if (tag) return tag;
        const { rows } = await pool.query('INSERT INTO tags (name) VALUES ($1) RETURNING *', [
          name,
        ]);
        return toCamelCase<Tag>(rows)[0];
      })
    );
    return tags;
  } catch (error) {
    console.error(error);
    return null;
  }
};
