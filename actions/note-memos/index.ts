'use server';

import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { NoteMemo, CreateNoteMemoRequest, QueryNoteMemo, TableNoteMemo } from './types';
import { NoteMemoQuerySort } from '@/enums/query';

/** 新增筆記備註 */
export const createNoteMemo = async (request: CreateNoteMemoRequest) => {
  const { postId, blockId, startOffset, endOffset, content, selectedContent } = request;
  const { rows } = await pool.query(
    'INSERT INTO post_memos (post_id, block_id, start_offset, end_offset, content, selected_content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [postId, blockId, startOffset, endOffset, content, selectedContent]
  );
  return toCamelCase<NoteMemo>(rows);
};

/** 更新筆記備註 */
export const updateNoteMemo = async (request: CreateNoteMemoRequest & { id: number }) => {
  const { id, postId, blockId, startOffset, endOffset, content } = request;
  const { rows } = await pool.query(
    'UPDATE post_memos SET post_id = $1, block_id = $2, start_offset = $3, end_offset = $4, content = $5 WHERE id = $6 RETURNING *',
    [postId, blockId, startOffset, endOffset, content, id]
  );
  return toCamelCase<NoteMemo>(rows);
};

// 刪除筆記備註
export const deleteNoteMemo = async (id: number) => {
  const { rows } = await pool.query('DELETE FROM post_memos WHERE id = $1 RETURNING *', [id]);
  return toCamelCase<NoteMemo>(rows);
};

/** 取得筆記備註列表 */
export const getNoteMemoList = async (request: QueryNoteMemo) => {
  const { postId, sort, order, page = 1, limit = 10 } = request;

  const values: (string | number)[] = [];
  const where: string[] = [];

  if (postId) {
    values.push(postId);
    where.push(`post_id = $${values.length}`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  values.push(limit);
  values.push(offset);

  let sortClause = 'ORDER BY created_at DESC';
  if (sort && Object.values(NoteMemoQuerySort).includes(sort)) {
    const direction = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sortField = (() => {
      switch (sort) {
        case NoteMemoQuerySort.CREATED_AT:
        default:
          return 'created_at';
      }
    })();
    sortClause = `ORDER BY ${sortField} ${direction}`;
  }
  //   const orderByClause = `ORDER BY created_at ${order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;

  // 查詢總數
  const countSql = `
    SELECT COUNT(*) AS total
    FROM post_memos
    ${whereClause}
  `;
  const countResult = await pool.query(countSql, values.slice(0, values.length - 2));
  const totalCount = Number(countResult.rows[0].total);

  // 查詢分頁資料
  const dataSql = `
    SELECT post_memos.*, posts.title AS post_title
    FROM post_memos
    LEFT JOIN posts ON post_memos.post_id = posts.id
    ${whereClause}
    ${sortClause}
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `;
  const { rows } = await pool.query(dataSql, values);
  const data = toCamelCase<TableNoteMemo>(rows);

  return {
    data,
    totalCount,
  };
};

/** 取得特定筆記備註 */
export const getNoteMemoByPostId = async (postId: string) => {
  const { rows } = await pool.query('SELECT * FROM post_memos WHERE post_id = $1', [postId]);
  const results = toCamelCase<NoteMemo>(rows).map(item => ({
    ...item,
    id: item.id.toString(),
  }));
  return results as (NoteMemo & { id: string })[];
};


/** 針對特定 postId 關聯的筆記備註進行刪除 */
export const deleteNoteMemosByPostId = async (postId: string) => {
  const { rows } = await pool.query('DELETE FROM post_memos WHERE post_id = $1', [postId]);
  return toCamelCase<NoteMemo>(rows);
};