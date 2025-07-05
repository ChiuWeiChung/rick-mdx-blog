'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Tag } from './types';
import { PoolClient } from 'pg';

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
export const checkTagExist = async (name: string, client?: PoolClient) => {
  try {
    const queryExecutor = client || pool;
    const { rows } = await queryExecutor.query('SELECT * FROM tags WHERE name = $1', [name]);
    if (rows.length === 0) return null;
    return toCamelCase<Tag>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 新增標籤 */
export const findOrCreateTags = async (names: string[], client?: PoolClient) => {
  try {
    const tags = await Promise.all(
      names.map(async name => {
        const tag = await checkTagExist(name, client);
        if (tag) return tag;

        const queryExecutor = client || pool;
        const { rows } = await queryExecutor.query(
          'INSERT INTO tags (name) VALUES ($1) RETURNING *',
          [name]
        );
        return toCamelCase<Tag>(rows)[0];
      })
    );
    return tags;
  } catch (error) {
    console.error(error);
    return null;
  }
};
