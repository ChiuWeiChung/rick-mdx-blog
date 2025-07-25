'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Overview, QueryNoteChart } from './types';

/** 取得「文章」「分類」「標籤」的數量 & 最近活動(新增文章 & 新增分類 & 新增標籤 & 更新文章) */
export const getOverviewInfo = async () => {
  // const sql = `
  //   SELECT
  //     (SELECT COUNT(*) FROM posts) AS note_count,
  //     (SELECT COUNT(*) FROM categories) AS category_count,
  //     (SELECT COUNT(*) FROM tags) AS tag_count,
  //     (SELECT created_at FROM posts ORDER BY created_at DESC LIMIT 1) AS last_created_note,
  //     (SELECT created_at FROM posts ORDER BY updated_at DESC LIMIT 1) AS last_updated_note
  //   `;

  const sql = `
    SELECT
      (SELECT COUNT(*) FROM posts) AS note_count,
      (SELECT COUNT(*) FROM categories) AS category_count,
      (SELECT COUNT(*) FROM tags) AS tag_count,
      (SELECT ROW_TO_JSON(t)
        FROM (SELECT created_at, updated_at, title
             FROM posts
             ORDER BY created_at DESC
             LIMIT 1) t) AS last_created_note,
     (SELECT ROW_TO_JSON(t)
        FROM (SELECT created_at, updated_at, title
             FROM posts
             ORDER BY updated_at DESC
             LIMIT 1) t) AS last_updated_note;
    `;
  // (SELECT created_at FROM categories ORDER BY created_at DESC LIMIT 1) AS last_category_created_at,
  // (SELECT created_at FROM tags ORDER BY created_at DESC LIMIT 1) AS last_tag_created_at
  const { rows } = await pool.query(sql);
  const last_created_note = toCamelCase<Overview['lastCreatedNote']>([rows[0].last_created_note])[0];
  const last_updated_note = toCamelCase<Overview['lastUpdatedNote']>([rows[0].last_updated_note])[0];
  const result = toCamelCase<Overview>([
    {
      ...rows[0],
      last_created_note,
      last_updated_note,
    },
  ])[0];
  return result;
};

/** 取得「文章」的新增統計 */
// export const getNoteChartData = async () => {
//     const sql = `
//     SELECT
//         TO_CHAR(created_at, 'YYYY-MM') AS month,
//         COUNT(*) AS count
//     FROM
//         posts
//     GROUP BY
//         TO_CHAR(created_at, 'YYYY-MM')
//     ORDER BY
//         month DESC;
//     `;
//     const { rows } = await pool.query<{
//         month: string;
//         count: number;
//     }>(sql);
//     return rows;
// }

export const getNoteChartData = async ({ startDate, endDate }: QueryNoteChart) => {
  const where: string[] = [];
  const values: string[] = [];

  values.push(new Date(startDate).toISOString());
  where.push(`created_at >= $${values.length}`);

  values.push(new Date(endDate).toISOString());
  where.push(`created_at <= $${values.length}`);

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD') AS month,
      COUNT(*) AS count
    FROM
      posts
    ${whereClause}
    GROUP BY
      TO_CHAR(created_at, 'YYYY-MM-DD')
    ORDER BY
      month ASC;
  `;

  const { rows } = await pool.query<{ month: string; count: number }>(sql, values);
  return rows;
};

// TODO 規劃瀏覽量統計 (待新增 Table Schema )
