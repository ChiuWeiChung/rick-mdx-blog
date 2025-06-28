import { getCategories } from '@/actions/categories';
import { queryNoteList } from '@/actions/notes';
import { coerceQueryNote, defaultQueryNoteValues, QueryNote } from '@/actions/notes/types';
import { getTags } from '@/actions/tags';
import { Button } from '@/components/ui/button';
import QuerySearchForm from '@/features/admin/notes/search-form';
import NoteTable from '@/features/admin/notes/table';
import { toOption } from '@/utils/format-utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotePageProps {
  searchParams?: Promise<Partial<QueryNote>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotesPage = async (props: NotePageProps) => {
  const data = await queryNoteList();
  const categories = await getCategories();
  const tags = await getTags();

  const categoryOptions = toOption(categories);
  const tagOptions = toOption(tags);

  const searchParams = await props.searchParams;
  console.log('searchParams', searchParams);
  const defaultValues = coerceQueryNote.parse(searchParams);
  console.log('coerceQueryNote defaultValues', defaultValues);

  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">筆記管理</h1>

      {/* Add Notes Section */}
      <Button type="button" className="absolute top-0 right-0">
        <Link href="/admin/notes/editor" className="flex items-center gap-2">
          <Plus /> 新增筆記
        </Link>
      </Button>

      {/* Search Notes Section */}
      <QuerySearchForm
        tagOptions={tagOptions}
        categoryOptions={categoryOptions}
        defaultValues={{ ...defaultQueryNoteValues, ...defaultValues }}
      />

      {/* Notes Table Section */}
      <h1 className="text-2xl font-bold">筆記列表</h1>
      <NoteTable data={data} />
    </div>
  );
};

export default NotesPage;
