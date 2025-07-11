'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { QueryTag, TableTag, Tag } from './types';
import format from 'pg-format';
import { PoolClient } from 'pg';
import { TagQuerySort } from '@/enums/query';

/** 取得所有標籤 */
export const getTagOptions = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM tags');
    const tags = toCamelCase<Tag>(rows);
    return tags.map(({ name, id }) => ({
      label: name,
      value: id,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** 取得標籤 */
export const getTagById = async (id: number) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tags WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return toCamelCase<Tag>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 檢查標籤是否存在 */
export const checkTagsExist = async (tagIds: number[], client?: PoolClient) => {
  if (!tagIds.length) return [];

  const queryExecutor = client || pool;

  const checkSql = format(
    `
    SELECT COUNT(*) = %L AS all_exist
    FROM tags
    WHERE id = ANY (ARRAY[%L]::integer[])
    `,
    tagIds.length,
    tagIds
  );

  const { rows: checkRows } = await queryExecutor.query(checkSql);
  const { allExist } = toCamelCase<{ allExist: boolean }>(checkRows)[0];

  if (!allExist) throw new Error('有標籤不存在');

  const { rows } = await queryExecutor.query(
    'SELECT * FROM tags WHERE id = ANY($1) ORDER BY array_position($1, id)',
    [tagIds]
  );
  return toCamelCase<Tag>(rows);
};

export const createTags = async (tagNames: string[], client?: PoolClient) => {
  if (!tagNames.length) return [];

  const queryExecutor = client || pool;

  // 產生 VALUES ($1), ($2), ...
  const valuesClause = tagNames.map(name => [name]);

  const sql = format(
    `
    INSERT INTO tags (name)
    VALUES %L
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `,
    valuesClause
  );

  const { rows } = await queryExecutor.query(sql);
  return toCamelCase<Tag>(rows);
};

/** 新增標籤 */
export const findOrCreateTags = async (idsOrNames: (string | number)[], client?: PoolClient) => {
  try {
    const ids = idsOrNames.filter(id => typeof id === 'number');
    const names = idsOrNames.filter(id => typeof id === 'string');

    // 檢查標籤是否存在
    const tagsExist = await checkTagsExist(ids, client);

    // 新增標籤
    const createdTags = await createTags(names, client);

    return [...tagsExist, ...createdTags];
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** 更新標籤 */
export const updateTagById = async (request: Tag) => {
  const { id, name } = request;
  try {
    const { rows } = await pool.query('UPDATE tags SET name = $1 WHERE id = $2 RETURNING *', [
      name,
      id,
    ]);
    return toCamelCase<Tag>(rows)[0];
  } catch (error) {
    console.error(error);
    return { success: false, message: '更新標籤失敗' };
  }
};

/** 刪除標籤 */
export const deleteTagById = async (id: number) => {
  try {
    const { rows } = await pool.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
    return toCamelCase<Tag>(rows)[0];
  } catch (error) {
    console.error(error);
    return { success: false, message: '刪除標籤失敗' };
  }
};

/** 取得標籤列表與文章數量關係 */
export const getTagWithNoteCount = async (request: QueryTag) => {
  const { name, sort, order, page, limit } = request;

  const where = [];
  const whereValues: (string | number)[] = [];

  if (name && name.trim() !== '') {
    whereValues.push(`%${name}%`);
    where.push(`t.name ILIKE $${whereValues.length}`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  // 查詢總數（只用 whereValues）
  const countResult = await pool.query(
    `
    SELECT COUNT(DISTINCT t.id) AS count
    FROM tags t
    LEFT JOIN post_tags pt ON t.id = pt.tag_id
    ${whereClause}
    `,
    whereValues
  );
  const totalCount = Number(countResult.rows[0].count);

  let sortClause = 'ORDER BY post_count DESC';
  if (sort && Object.values(TagQuerySort).includes(sort)) {
    const direction = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sortField = (() => {
      switch (sort) {
        case TagQuerySort.POST_COUNT:
          return 'post_count';
        case TagQuerySort.NAME:
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
    SELECT t.*, COUNT(pt.post_id) AS post_count
    FROM tags t
    LEFT JOIN post_tags pt ON t.id = pt.tag_id
    ${whereClause}
    GROUP BY t.id, t.name
    ${sortClause}
    ${paginationClause}
    `,
    fullValues
  );

  return {
    data: toCamelCase<TableTag>(rows),
    totalCount,
  };
};
