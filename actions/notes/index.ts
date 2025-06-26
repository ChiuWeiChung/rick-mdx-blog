'use server';
import pool from '@/lib/db';
import { CreateNote, Note } from './types';
import { toCamelCase } from '@/utils/format-utils';
import { auth } from '@/auth';
import { getUser } from '../users';
import { createCategory } from '../categories';
import { createTags } from '../tags';
import { saveMarkdownFile } from '../s3/markdown';
import { checkFileExists } from '../s3/image';
import { createNoteTags } from '../note-tags';


export const queryNoteList = async () => {
  const { rows } = await pool.query(`
    SELECT
      posts.id,
      title,
      visible,
      username,
      categories.name AS category,
      STRING_AGG(tags.name, ', ') AS tags,
      file_path,
      cover_path,
      posts.created_at,
      posts.updated_at
    FROM
      posts
      LEFT JOIN post_tags ON post_tags.post_id = posts.id
      LEFT JOIN tags ON tags.id = post_tags.tag_id
      LEFT JOIN users ON users.id = posts.user_id
      LEFT JOIN categories ON categories.id = posts.category_id
    GROUP BY
      posts.id,
      users.username,
      categories.name
    ORDER BY
      posts.created_at DESC
  `);
  const camelCaseRows = toCamelCase<Record<string, unknown>>(rows);
  const formattedRows = camelCaseRows.map(row => {
    const rowTags = row.tags as string;
    const tags = rowTags?.split(',') ?? [];
    return { ...row, tags };
  });
  return formattedRows as Note[];
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
