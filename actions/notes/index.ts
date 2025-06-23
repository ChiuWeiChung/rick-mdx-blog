'use server';
import pool from '@/lib/db';
import { CreateNote, Note } from './types';
import { toCamelCase } from '@/utils/format-utils';
import { auth } from '@/auth';
import { getUser } from '../users';
import { createCategory } from '../categories';
import { createTags } from '../tags';
import { saveMarkdownFile, saveUploadedMarkdownFile } from '../markdown';
import { checkFileExists } from '../image';
import { createNoteTags } from '../note-tags';

//
export const createNote = async (note: CreateNote) => {
  const { title, content, file, category, tags, visible } = note;

  try {
    const session = await auth();

    if (!session?.user || !session.user.email || !session.provider) {
      throw new Error('Unauthorized');
    }

    const {
      provider,
      user: { email },
    } = session;

    const user = await getUser({ provider, email });

    if (!user) {
      throw new Error('User not found');
    }

    // 如果 category 存在，則取得 category_id，若無則新增 category 並取得 category_id
    const createdCategory = await createCategory(category);
    if (!createdCategory) {
      throw new Error('Category not found');
    }

    // 如果 tags 存在，則取得 tag_id，若無則新增 tag 並取得 tag_id
    const createdTags = await createTags(tags);
    if (!createdTags) {
      throw new Error('Tags not found');
    }

    let filePath = '';

    // 如果是上傳檔案，則上傳檔案
    if (file) {
      filePath = await saveUploadedMarkdownFile({
        file,
        title,
        category,
      });
    } else {
      // 如果是手動輸入，則轉成 markdown 檔案並上傳
      filePath = await saveMarkdownFile({
        content,
        title,
        category,
      });
    }

    if (!filePath) {
      throw new Error('Failed to save markdown file');
    }

    // 取得封面
    const isCoverExist = await checkFileExists(`${category}/card.png`);
    const coverPath = isCoverExist ? `${category}/card.png` : null;

    console.log('isCoverExist', isCoverExist);
    console.log('coverPath', coverPath);

    // 新增 post
    const { rows } = await pool.query(
      'INSERT INTO posts (title, user_id, visible, created_at, updated_at, category_id, file_path, cover_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, user.id, visible, new Date(), new Date(), createdCategory.id, filePath, coverPath]
    );

    const noteId = toCamelCase<Note>(rows)[0].id;

    // 新增 tags 的關聯，以及 post_tags 的關聯
    await createNoteTags(
      noteId,
      createdTags.map(tag => tag.id)
    );

    return toCamelCase<Note>(rows)[0];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create note');
  }
};
