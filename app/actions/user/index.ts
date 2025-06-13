'use server';
import { signIn, signOut } from '@/auth';
import pool from '@/lib/db';
import { toCamelCase } from '@/utils/format-utils';
import { User } from './types';

export const signOutAction = async () => {
	await signOut();
};

export const signInAction = async () => {
	await signIn('google', { redirectTo: '/' });
};

// export const
export const checkUserExist = async ({ provider, email }: { provider: string; email: string }) => {
	try {
		const { rows } = await pool.query('SELECT * FROM users WHERE provider = $1 AND email = $2', [
			provider,
			email,
		]);
		if (rows.length === 0) return null;
		return toCamelCase<User>(rows)[0];
	} catch (error) {
		console.error(error);
		return null;
	}
};
