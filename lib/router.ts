'use server';

import { headers } from 'next/headers';

export const getOrigin = async () => {
  const h = await headers();

  // NOTE: 用 x-forwarded-host + x-forwarded-proto 來還原外部網址：
  const proto =
    h.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');

  const host = h.get('x-forwarded-host') ?? h.get('host');
  return `${proto}://${host}`;
};
