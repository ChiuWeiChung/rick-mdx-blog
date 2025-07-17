import { coerceQueryNoteSchema, QueryNote } from '@/actions/notes/types';
import SpinnerLoader from '@/components/spinner-loader';
import NotesSection from '@/features/client/notes-section';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getCategoryById } from '@/actions/categories';

interface NotesPageProps {
  searchParams: Promise<QueryNote>;
}

export async function generateMetadata(props: NotesPageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const { category } = coerceQueryNoteSchema.parse(searchParams ?? {});
  const metadata: Metadata = {
    title: "Rick's DevNote - 筆記列表",
    description: '筆記列表',
  };

  if (typeof category !== 'number') return metadata;

  const foundCategory = await getCategoryById(category);

  if (foundCategory) {
    metadata.title = `Rick's DevNote - ${foundCategory.name}`;
    metadata.description = `筆記列表 - ${foundCategory.name}`;
  }

  return metadata;
}

export default async function NotesPage(props: NotesPageProps) {
  const searchParams = await props.searchParams;
  const queryRequest = coerceQueryNoteSchema.parse(searchParams); // 預設只取前六筆資料

  return (
    <Suspense fallback={<SpinnerLoader />}>
      <NotesSection request={queryRequest} showPagination={true} />
    </Suspense>
  );
}
