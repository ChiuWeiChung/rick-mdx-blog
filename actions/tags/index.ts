'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Tag } from './types';
import format from 'pg-format';
import { PoolClient } from 'pg';

/** 取得所有標籤 */
export const getTagOptions = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM tags');
    const tags = toCamelCase<Tag>(rows);
    return tags.map(({ name,id }) => ({
      label: name,
      value: id,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** 檢查標籤是否存在 */
// export const checkTagExist = async (name: string, client?: PoolClient) => {
//   try {
//     const queryExecutor = client || pool;
//     const { rows } = await queryExecutor.query('SELECT * FROM tags WHERE name = $1', [name]);
//     if (rows.length === 0) return null;
//     return toCamelCase<Tag>(rows)[0];
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
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
export const findOrCreateTags = async (idsOrNames: (string|number)[], client?: PoolClient) => {
  try {
    const ids = idsOrNames.filter(id => typeof id === 'number');
    const names = idsOrNames.filter(id => typeof id === 'string');

    const tagsExist = await checkTagsExist(ids, client);
    
    const createdTags = await createTags(names, client);

    return [...tagsExist, ...createdTags];

    // const tags = await Promise.all(
    //   names.map(async name => {
    //     const tag = await checkTagExist(name, client);
    //     if (tag) return tag;

    //     const queryExecutor = client || pool;
    //     const { rows } = await queryExecutor.query(
    //       'INSERT INTO tags (name) VALUES ($1) RETURNING *',
    //       [name]
    //     );
    //     return toCamelCase<Tag>(rows)[0];
    //   })
    // );
    // return tags;
  } catch (error) {
    console.error(error);
    return null;
  }
};
