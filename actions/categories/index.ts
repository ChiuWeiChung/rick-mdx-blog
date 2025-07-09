'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Category, CreateCategoryRequest, QueryCategory, TableCategory } from './types';
import { PoolClient } from 'pg';
import { CategoryQuerySort } from '@/enums/query';
import { uploadImage } from '../s3/image';

/** 取得所有分類 */
export const getCategoryOptions = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories');
    const categories = toCamelCase<Category>(rows);
    return categories.map(({ name,id }) => ({
      label: name,
      value: id,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** 檢查分類是否存在 */
export const checkCategoryExist = async (categoryId: number, client?: PoolClient) => {
  try {
    const queryExecutor = client || pool;
    const { rows } = await queryExecutor.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    if (rows.length === 0) return null;
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 新增分類 */
export const createCategory = async (
  request: { name: string; coverFile?: File | null; iconFile?: File | null },
  client?: PoolClient
) => {
  try {
    const queryExecutor = client || pool;
    const { name, coverFile, iconFile } = request;

    // 上傳檔案
    const coverPath = coverFile
      ? await uploadImage({ file: coverFile, fileName: 'cover', folder: `categories/${name}` })
      : null;
    const iconPath = iconFile
      ? await uploadImage({ file: iconFile, fileName: 'icon', folder: `categories/${name}` })
      : null;

    const { rows } = await queryExecutor.query(
      'INSERT INTO categories (name, cover_path, icon_path) VALUES ($1, $2, $3) RETURNING *',
      [name, coverPath, iconPath]
    );
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 更新分類 */
export const updateCategory = async (
  request: CreateCategoryRequest & { id: number },
  client?: PoolClient
) => {
  try {
    const queryExecutor = client || pool;
    const { id, name, coverFile, iconFile } = request;

    const updates: string[] = ['name = $1'];
    const values: (string | number)[] = [name];
    let paramIndex = 2;

    // 處理封面圖片
    if (coverFile) {
      const coverPath = await uploadImage({
        file: coverFile,
        fileName: 'cover',
        folder: `categories/${name}`,
      });
      updates.push(`cover_path = $${paramIndex++}`);
      values.push(coverPath);
    }

    // 處理圖示圖片
    if (iconFile) {
      const iconPath = await uploadImage({
        file: iconFile,
        fileName: 'icon',
        folder: `categories/${name}`,
      });
      updates.push(`icon_path = $${paramIndex++}`);
      values.push(iconPath);
    }

    // id 為最後一個參數
    values.push(id);

    const sql = `
      UPDATE categories
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const { rows } = await queryExecutor.query(sql, values);
    return toCamelCase<Category>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};


/** 檢查分類是否存在，不存在則新增，存在則返回該分類 */
export const findOrCreateCategory = async (
  idOrName: string|number,
  client?: PoolClient,
  throwErrorIfExists?: boolean
) => {
  try {
    if(typeof idOrName === 'number') {
      const existingCategory = await checkCategoryExist(idOrName, client);
      if (existingCategory) {
        if (throwErrorIfExists) throw new Error('分類已存在');
        return existingCategory;
      }
    } 

    if(typeof idOrName === 'string') {
      const newCategory = await createCategory({ name: idOrName }, client);
      if(!newCategory) throw new Error('新增分類失敗');
      return newCategory;
    }

    throw new Error('分類不存在');

  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 新增分類 (支援上傳檔案) */
export const createCategoryWithFile = async (request: CreateCategoryRequest) => {
  try {
    const category = await createCategory(request);
    if (!category) throw new Error('Create category failed');
    return category;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Create category failed' };
  }
};

/** 更新分類 (支援上傳檔案) */
export const updateCategoryWithFile = async (request: CreateCategoryRequest & { id: number }) => {
  try {
    const category = await updateCategory(request);
    if (!category) throw new Error('Update category failed');
    return category;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Update category failed' };
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
