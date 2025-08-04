'use server';
import pool from '@/lib/db';
import { CreateNoteRequest, Note, NoteDetail, QueryNote, UpdateNoteRequest } from './types';
import { toCamelCase } from '@/utils/format-utils';
import { auth } from '@/auth';
import { getUser } from '../users';
import { findOrCreateCategory } from '../categories';
import { findOrCreateTags } from '../tags';
import { saveMarkdownFile, deleteMarkdownFile } from '../s3/markdown';
import { createNoteTags } from '../note-tags';
import { NoteQuerySort } from '@/enums/query';
import { Option } from '@/types/global';
import { cache } from 'react';

/** 查詢筆記列表 */
export const queryNoteList = async (request: QueryNote) => {
  const {
    title,
    visible,
    category,
    tags,
    startCreatedTime,
    endCreatedTime,
    startUpdatedTime,
    endUpdatedTime,
    sort,
    order,
    page = 1,
    limit = 10,
  } = request;

  const values: unknown[] = [];
  const where: string[] = [];

  if (typeof visible === 'boolean') {
    values.push(visible);
    where.push(`posts.visible = $${values.length}`);
  }

  if (title && title.trim() !== '') {
    values.push(`%${title}%`);
    where.push(`posts.title ILIKE $${values.length}`);
  }

  if (typeof category === 'number') {
    values.push(category);
    where.push(`posts.category_id = $${values.length}`);
  }

  if (startCreatedTime) {
    const startDate = new Date(startCreatedTime).toISOString(); // 需轉換為 ISO 格式 (因為目前的 startCreatedTime 是毫秒級別的 timestamp)
    values.push(startDate);
    where.push(`posts.created_at >= $${values.length}`);
  }
  if (endCreatedTime) {
    const endDate = new Date(endCreatedTime).toISOString();
    values.push(endDate);
    where.push(`posts.created_at <= $${values.length}`);
  }

  if (startUpdatedTime) {
    const startDate = new Date(startUpdatedTime).toISOString();
    values.push(startDate);
    where.push(`posts.updated_at >= $${values.length}`);
  }
  if (endUpdatedTime) {
    const endDate = new Date(endUpdatedTime).toISOString();
    values.push(endDate);
    where.push(`posts.updated_at <= $${values.length}`);
  }

  if (tags && tags.length > 0) {
    values.push(tags);
    values.push(tags.length);

    where.push(`
    posts.id IN (
      SELECT post_id
      FROM post_tags
      WHERE tag_id = ANY($${values.length - 1})
      GROUP BY post_id
      HAVING COUNT(DISTINCT tag_id) = $${values.length}
    )
  `);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  // 保存 WHERE 條件的參數（用於查詢總數）
  const whereValues = [...values];

  // 添加分頁參數
  let paginationClause = '';
  if (typeof limit === 'number') {
    values.push(limit);
    paginationClause += `LIMIT $${values.length} `;
  }
  if (typeof page === 'number' && typeof limit === 'number') {
    // calculate offset through page
    const offset = (page - 1) * limit;
    values.push(offset);
    paginationClause += `OFFSET $${values.length}`;
  }

  // 查詢總數（只使用 WHERE 條件參數）
  const countResult = await pool.query(
    `
    SELECT
      COUNT(DISTINCT posts.id) AS count
    FROM
      posts
      LEFT JOIN post_tags ON post_tags.post_id = posts.id
    ${whereClause}
    `,
    whereValues
  );
  const totalCount = Number(countResult.rows[0].count);

  let sortClause = 'ORDER BY posts.created_at DESC'; // 預設排序
  if (sort && Object.values(NoteQuerySort).includes(sort)) {
    const direction = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    // 注意：category、username 並非 posts 的欄位，要額外對應
    const sortField = (() => {
      switch (sort) {
        case NoteQuerySort.UPDATED_AT:
          return 'posts.updated_at';
        case NoteQuerySort.CREATED_AT:
        default:
          return 'posts.created_at';
      }
    })();
    sortClause = `ORDER BY ${sortField} ${direction}`;
  }

  // 查詢實際資料
  const { rows } = await pool.query(
    `
    SELECT
      posts.id,
      posts.title,
      posts.visible,
      users.username,
      categories.name AS category,
      STRING_AGG(tags.name, ', ') AS tags,
      posts.file_path,
      posts.created_at,
      posts.updated_at,
      posts.description
    FROM
      posts
      LEFT JOIN post_tags ON post_tags.post_id = posts.id
      LEFT JOIN tags ON tags.id = post_tags.tag_id
      LEFT JOIN users ON users.id = posts.user_id
      LEFT JOIN categories ON categories.id = posts.category_id
    ${whereClause}
    GROUP BY
      posts.id,
      users.username,
      categories.name
    ${sortClause}
    ${paginationClause}
  `,
    values
  );

  const camelCaseRows = toCamelCase<Record<string, unknown>>(rows);
  const formattedRows = camelCaseRows.map(row => {
    const rowTags = row.tags as string;
    const tags =
      rowTags
        ?.split(',')
        .map(tag => tag.trim())
        .filter(Boolean) ?? [];
    return { ...row, tags };
  });

  return {
    data: formattedRows as Note[],
    totalCount,
  };
};

/** 新增筆記 */
export const createNote = async (note: CreateNoteRequest) => {
  const { title, content, category, tags, visible, fileName, createdAt, description } = note;
  const client = await pool.connect();

  try {
    // ====================== 開始 Transaction ======================
    await client.query('BEGIN');

    const session = await auth();
    if (!session?.user || !session.user.email || !session.provider) {
      throw new Error('Unauthorized');
    }

    const {
      provider,
      user: { email },
    } = session;

    const user = await getUser({ provider, email }, client);
    if (!user) throw new Error('User not found');

    // 如果 category 存在，則取得 category_id，若無則新增 category 並取得 category_id
    const selectedCategory = await findOrCreateCategory(category, client);
    if (!selectedCategory) throw new Error('Category not found');

    // 如果 tags 存在，則取得 tag_id，若無則新增 tag 並取得 tag_id
    const selectedTags = await findOrCreateTags(tags, client);
    if (!selectedTags) throw new Error('Tags not found');

    // 上傳檔案至 S3
    const filePath = await saveMarkdownFile({ content, category: selectedCategory.name, fileName });
    if (!filePath) throw new Error('Failed to save markdown file');
    
    // 新增 post 至 DB
    const sql = `
    INSERT INTO
      posts (
        title,
        user_id,
        visible,
        created_at,
        updated_at,
        category_id,
        file_path,
        description
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const { rows } = await client.query(sql, [
      title,
      user.id,
      visible,
      createdAt ?? new Date(),
      createdAt ?? new Date(),
      selectedCategory.id,
      filePath,
      description,
    ]);
    const noteId = toCamelCase<Note>(rows)[0].id;

    // 新增 tags 的關聯，以及 post_tags 的關聯
    await createNoteTags(
      noteId,
      selectedTags.map(tag => tag.id),
      client
    );

    // ====================== Commit Transaction ======================
    await client.query('COMMIT');
    return toCamelCase<Note>(rows)[0];
  } catch (error) {
    // ====================== Rollback Transaction ======================
    await client.query('ROLLBACK');
    console.error('Create note error:', error);
    return { success: false, message: 'Failed to create note' };
  } finally {
    // release client
    client.release();
  }
};

/** 更新筆記 */
export const updateNote = async (note: UpdateNoteRequest) => {
  const { id, title, content, category, tags, fileName, createdAt, description } = note;
  const client = await pool.connect();

  try {
    // ====================== 開始 Transaction ======================
    await client.query('BEGIN');

    const session = await auth();
    if (!session?.user || !session.user.email || !session.provider) {
      throw new Error('Unauthorized');
    }

    const {
      provider,
      user: { email },
    } = session;

    const user = await getUser({ provider, email }, client);
    if (!user) throw new Error('User not found');

    // 檢查筆記是否存在
    const checkNoteExistSql = `
    SELECT
      id,
      user_id,
      file_path,
      created_at
    FROM
      posts
    WHERE
      id = $1
    `;
    const result = await client.query(checkNoteExistSql, [id]);
    const existingNote = toCamelCase<Note>(result.rows)[0];
    if (!existingNote) throw new Error('Note not found');

    // NOTE: 暫時不檢查是否屬於當前使用者，因為筆記的 owner 是 admin

    // 如果 category 存在，則取得 category_id，若無則新增 category 並取得 category_id
    const selectedCategory = await findOrCreateCategory(category, client);
    if (!selectedCategory) throw new Error('Category not found');

    // 如果 tags 存在，則取得 tag_id，若無則新增 tag 並取得 tag_id
    const selectedTags = await findOrCreateTags(tags, client);
    if (!selectedTags) throw new Error('Tags not found');

    // 更新 markdown 檔案內容
    const filePath = await saveMarkdownFile({ content, category: selectedCategory.name, fileName });
    if (!filePath) throw new Error('Failed to save markdown file');
    
    // 更新 post
    const sql = `
    UPDATE
      posts
    SET
      title = $1,
      created_at = $2,
      updated_at = $3,
      category_id = $4,
      file_path = $5,
      description = $6
    WHERE
      id = $7 RETURNING *
    `;
    await client.query(
      sql,
      [title, createdAt, new Date(), selectedCategory.id, filePath, description, id]
    );

    // 刪除舊的 post_tags 關聯
    await client.query('DELETE FROM post_tags WHERE post_id = $1', [id]);

    // 新增新的 post_tags 關聯
    await createNoteTags(
      id,
      selectedTags.map(tag => tag.id),
      client
    );

    // ====================== Commit Transaction ======================
    await client.query('COMMIT');
    return { success: true, message: 'Note updated successfully' };
  } catch (error) {
    // ====================== Rollback Transaction ======================
    await client.query('ROLLBACK');
    console.error('Update note error:', error);
    return { success: false, message: 'Failed to update note' };
  } finally {
    // release client
    client.release();
  }
};

/** 刪除筆記 */
export const deleteNote = async (noteId: number) => {
  const client = await pool.connect();

  try {
    // ====================== 開始 Transaction ======================
    await client.query('BEGIN');

    // 檢查用戶認證
    const session = await auth();
    if (!session?.user || !session.user.email || !session.provider) {
      throw new Error('Unauthorized');
    }

    const {
      provider,
      user: { email },
    } = session;

    const user = await getUser({ provider, email }, client);
    if (!user) throw new Error('User not found');

    // 獲取筆記資訊，包括檔案路徑
    const noteResult = await client.query(
      'SELECT id, title, file_path, user_id FROM posts WHERE id = $1',
      [noteId]
    );

    if (noteResult.rows.length === 0) throw new Error('Note not found');
    const note = noteResult.rows[0];

    // NOTE: 暫時不檢查是否屬於當前使用者，因為筆記的 owner 是 admin
    // 刪除筆記記錄
    await client.query('DELETE FROM posts WHERE id = $1', [noteId]);

    // 如果有關聯的 markdown 檔案，從 S3 刪除
    if (note.file_path) await deleteMarkdownFile(note.file_path);

    // ====================== Commit Transaction ======================
    await client.query('COMMIT');
    return { success: true, message: 'Note deleted successfully' };
  } catch (error) {
    // ====================== Rollback Transaction ======================
    await client.query('ROLLBACK');
    console.error('Delete note error:', error);
    return { success: false, message: 'Failed to delete note' };
  } finally {
    // release client
    client.release();
  }
};

/** 取得單一筆記的基本資訊，包含 title、visible、created_at、category、file_path、tags */
export const getNoteInfoById = cache(async (noteId: string) => {
  const { rows } = await pool.query(
    `
    SELECT
      posts.id AS id,
      title,
      visible,
      created_at,
      updated_at,
      categories.id AS category,
      file_path,
      JSON_AGG(
        JSON_BUILD_OBJECT('id', tags.id, 'name', tags.name)
      ) AS tags
    FROM posts 
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    LEFT JOIN categories ON categories.id = posts.category_id
    WHERE posts.id = $1
    GROUP BY posts.id, categories.id
    `,
    [noteId]
  );

  if (rows.length === 0) return null;

  const [camelCaseRow] = toCamelCase<Record<string, unknown>>(rows);
  return camelCaseRow as Omit<NoteDetail, 'tags'> & { tags: { id: number; name: string }[] };
});

/** 更新筆記的 visible 狀態 */
export const updateNoteVisible = async (request: { noteId: number; visible: boolean }) => {
  const { noteId, visible } = request;
  try{
    await pool.query('UPDATE posts SET visible = $1 WHERE id = $2 RETURNING *', [
      visible,
      noteId,
    ]);
    return { success: true, message: 'Note visible updated successfully' };
  } catch (error) {
    console.error('Update note visible error:', error);
    return { success: false, message: 'Note visible update failed' };
  }
};


/** 取得筆記標題 */
export const getNoteOptions = async () => {
  try {
    const { rows } = await pool.query('SELECT id, title FROM posts');
    const camelCaseRows = toCamelCase<Record<string, unknown>>(rows);
    return camelCaseRows.map(({ id, title }) => ({ label: title, value: String(id) })) as Option<string>[];
  } catch (error) {
    console.error('Get note options error:', error);
    return [];
  }
};