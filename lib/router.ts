'use server';

import { headers } from 'next/headers';

export const getOrigin = async () => {
  const headersList = await headers();
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';
  const host = headersList.get('host');
  const origin = `${protocol}://${host}`;
  return origin;
};