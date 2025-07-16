import { coerceQueryNoteSchema, QueryNote } from '@/actions/notes/types';
import SpinnerLoader from '@/components/spinner-loader';
import NotesSection from '@/features/client/notes-section';
import { Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Rick's DevNote - 筆記列表",
  description: '筆記列表',
};

interface NotesPageProps {
  searchParams: Promise<QueryNote>;
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