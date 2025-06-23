'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { NoteTag } from './types';

// TODO: 需要新增 post_tags 的關聯 sql 語法

export const createNoteTags = async (noteId: number, tagIds: number[]) => {
  if (tagIds.length === 0) {
    return [];
  }

  // 使用 Promise.all 來並行執行多個 INSERT 操作
  const insertPromises = tagIds.map(tagId =>
    pool.query('INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) RETURNING *', [
      noteId,
      tagId,
    ])
  );

  const results = await Promise.all(insertPromises);
  const rows = results.flatMap(result => result.rows);

  return toCamelCase<NoteTag>(rows);
};
