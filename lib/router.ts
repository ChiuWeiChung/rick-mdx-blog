'use server';

import { headers } from 'next/headers';

// TODO 待確認可行性，是否需要使用
export const getOrigin = async () => {
  const headersList = await headers();
  const fallbackProtocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const protocol = headersList.get('x-forwarded-proto') ?? fallbackProtocol;
  const host = headersList.get('host');
  const origin = `${protocol}://${host}`;
  return origin;
};