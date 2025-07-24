'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidatePathUtils(path: string): Promise<void> {
  revalidatePath(path);
}

export async function revalidateTagUtils(tag: string): Promise<void> {
  revalidateTag(tag);
}