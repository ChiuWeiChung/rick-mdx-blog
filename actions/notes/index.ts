'use server';
import pool from '@/lib/db';
import { CreateNote, Note, NoteDetail, QueryNote } from './types';
import { toCamelCase } from '@/utils/format-utils';
import { auth } from '@/auth';
import { getUser } from '../users';
import { createCategory } from '../categories';
import { createTags } from '../tags';
import { saveMarkdownFile } from '../s3/markdown';
import { checkFileExists } from '../s3/image';
import { createNoteTags } from '../note-tags';
import { NoteQuerySort } from '@/enums/query';

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

  const values: any[] = [];
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
    SELECT COUNT(DISTINCT posts.id) AS count
    FROM posts
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
      posts.cover_path,
      posts.created_at,
      posts.updated_at
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

export const createNote = async (note: CreateNote) => {
  const { title, content, file, category, tags, visible, fileName, manualUpload } = note;

  // 獲取數據庫客戶端連接
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

    if (!user) {
      throw new Error('User not found');
    }

    // 如果 category 存在，則取得 category_id，若無則新增 category 並取得 category_id
    const createdCategory = await createCategory(category, client);
    if (!createdCategory) {
      throw new Error('Category not found');
    }

    // 如果 tags 存在，則取得 tag_id，若無則新增 tag 並取得 tag_id
    const createdTags = await createTags(tags, client);
    if (!createdTags) {
      throw new Error('Tags not found');
    }

    let filePath = '';

    // 如果是上傳檔案，則上傳檔案
    const saveRequest =
      file && manualUpload ? { file, category, fileName } : { content, category, fileName };
    filePath = await saveMarkdownFile(saveRequest);

    if (!filePath) {
      throw new Error('Failed to save markdown file');
    }

    // 取得 category 對應的封面
    const isCoverExist = await checkFileExists(`${category}/card.png`);
    const coverPath = isCoverExist ? `${category}/card.png` : null;

    // 新增 post
    const { rows } = await client.query(
      'INSERT INTO posts (title, user_id, visible, created_at, updated_at, category_id, file_path, cover_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, user.id, visible, new Date(), new Date(), createdCategory.id, filePath, coverPath]
    );

    const noteId = toCamelCase<Note>(rows)[0].id;

    // 新增 tags 的關聯，以及 post_tags 的關聯
    await createNoteTags(
      noteId,
      createdTags.map(tag => tag.id),
      client
    );

    // ====================== Commit Transaction ======================
    await client.query('COMMIT');

    return toCamelCase<Note>(rows)[0];
  } catch (error) {
    // ====================== Rollback Transaction ======================
    await client.query('ROLLBACK');
    console.error(error);
    throw new Error('Failed to create note');
  } finally {
    // release client
    client.release();
  }
};


export const getNoteInfoById = async (noteId: string) => {
  const { rows } = await pool.query(
    `
    SELECT posts.id AS note_id, title, visible, created_at, categories.name AS category, file_path, STRING_AGG(tags.name, ', ') AS tags
    FROM posts 
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    LEFT JOIN categories ON categories.id = posts.category_id
    WHERE posts.id = $1
    GROUP BY posts.id, categories.name
    `,
    [noteId]
  );
  
  if(rows.length === 0) return null;

  const [camelCaseRow] = toCamelCase<Record<string, unknown>>(rows);

  const rowTags = camelCaseRow.tags as string;
  const tags = rowTags.split(', ')
    .map(tag => tag.trim())
    .filter(Boolean) ?? [];
  return { ...camelCaseRow, tags } as NoteDetail;
};