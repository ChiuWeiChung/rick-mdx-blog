'use server';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { User } from './types';
import { PoolClient } from 'pg';

export const getUser = async (
  { provider, email }: { provider: string; email: string },
  client?: PoolClient
) => {
  try {
    const queryExecutor = client || pool;
    const { rows } = await queryExecutor.query(
      'SELECT * FROM users WHERE provider = $1 AND email = $2',
      [provider, email]
    );
    if (rows.length === 0) return null;
    return toCamelCase<User>(rows)[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
