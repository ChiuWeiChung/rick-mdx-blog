'use server';
import { signIn, signOut } from '@/auth';

export const signOutAction = async () => {
  await signOut({ redirectTo: '/' });
};

export const signInAction = async () => {
  await signIn('google', { redirectTo: '/' });
};
