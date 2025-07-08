'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Category, QueryCategory, TableCategory } from './types';
import { PoolClient } from 'pg';
import { CategoryQuerySort } from '@/enums/query';

/** 取得所有分類 */
export const getAllCategories = async () => {
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
export const createCategory = async (name: string, client?: PoolClient) => {
  try {
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

/** 檢查分類是否存在，不存在則新增，存在則返回該分類 */
export const findOrCreateCategory = async (
  name: string,
  client?: PoolClient,
  throwErrorIfExists?: boolean
) => {
  try {
    const existingCategory = await checkCategoryExist(name, client);
    if (existingCategory) {
      if (throwErrorIfExists) throw new Error('分類已存在');
      return existingCategory;
    }

    const newCategory = await createCategory(name, client);
    return newCategory;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 取得分類列表與文章數量關係 */
export const getCategoryWithNoteCount = async (request: QueryCategory) => {
  const { name, sort, order, page, limit } = request;

  const where = [];
  const whereValues: (string | number)[] = [];

  if (name && name.trim() !== '') {
    whereValues.push(`%${name}%`);
    where.push(`c.name ILIKE $${whereValues.length}`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  
  // 查詢總數（只用 whereValues）
  const countResult = await pool.query(
    `
    SELECT COUNT(DISTINCT c.id) AS count
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id
    ${whereClause}
    `,
    whereValues
  );
  const totalCount = Number(countResult.rows[0].count);

  // sort clause
  let sortClause = 'ORDER BY post_count DESC';
  if (sort && Object.values(CategoryQuerySort).includes(sort)) {
    const direction = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sortField = (() => {
      switch (sort) {
        case CategoryQuerySort.POST_COUNT:
          return 'post_count';
        case CategoryQuerySort.NAME:
          return 'c.name';
        default:
          return 'post_count';
      }
    })();

    sortClause = `ORDER BY ${sortField} ${direction}`;
  }

  // 分頁條件
  const fullValues = [...whereValues];
  const limitIndex = fullValues.push(limit); // e.g. $2
  const offsetIndex = fullValues.push((page - 1) * limit);

  const paginationClause = `LIMIT $${limitIndex} OFFSET $${offsetIndex}`;

  // 主要資料查詢
  const { rows } = await pool.query(
    `
    SELECT c.*, COUNT(p.id) AS post_count
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id
    ${whereClause}
    GROUP BY c.id, c.name
    ${sortClause}
    ${paginationClause}
    `,
    fullValues
  );

  return {
    data: toCamelCase<TableCategory>(rows),
    totalCount,
  };
};
