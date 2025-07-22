import { getCategoryOptions } from '@/actions/categories';
import { queryNoteList } from '@/actions/notes';
import { coerceQueryNoteSchema, defaultQueryNoteValues, QueryNote } from '@/actions/notes/types';
import { getTagOptions } from '@/actions/tags';
import { Button } from '@/components/ui/button';
import QuerySearchForm from '@/features/admin/notes/search-form';
import NoteTable from '@/features/admin/notes/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotePageProps {
  searchParams?: Promise<Partial<QueryNote>>;
}

const NotesPage = async (props: NotePageProps) => {
  const categoryOptions = await getCategoryOptions();
  const tagOptions = await getTagOptions();

  const searchParams = await props.searchParams; // 取得查詢參數
  const queryRequest = coerceQueryNoteSchema.parse(searchParams); // 解析查詢參數
  const { data, totalCount } = await queryNoteList({ ...queryRequest }); // 取得筆記列表

  return (
    <>
      <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">筆記管理</h1>

      {/* Add Notes Section */}
      <Link href="/admin/notes/editor" className="self-end">
        <Button type="button">
          <Plus />
          新增筆記
        </Button>
      </Link>

      {/* Search Notes Section */}
      <QuerySearchForm
        tagOptions={tagOptions}
        categoryOptions={categoryOptions}
        defaultValues={{ ...defaultQueryNoteValues, ...queryRequest }}
      />

      {/* Notes Table Section */}
      <NoteTable data={data} totalCount={totalCount} />
    </>
  );
};

export default NotesPage;
