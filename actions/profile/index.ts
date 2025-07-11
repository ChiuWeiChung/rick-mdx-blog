'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { Profile } from './types';
import { saveProfileFile } from '../s3/markdown';
import { revalidateTag } from 'next/cache';

/** 取得所有標籤 */
export const getProfile = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM profile_config');
    return toCamelCase<Profile>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const upsertProfile = async (request: { content: string }) => {
  const { content } = request;
  try {
    const profilePath = await saveProfileFile({ content });

    await pool.query(
      `
        INSERT INTO profile_config (id, profile_path)
        VALUES (1, $1)
        ON CONFLICT (id)
        DO UPDATE SET
        profile_path = EXCLUDED.profile_path,
        updated_at = CURRENT_TIMESTAMP;
    `,
      [profilePath]
    );

    revalidateTag('profile');
    return { success: true, message: 'Profile upserted successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to upsert profile' };
  }
};
