import { getCategories } from '@/actions/categories';
import { coerceQueryNote, defaultQueryNoteValues, QueryNote } from '@/actions/notes/types';
import { getTags } from '@/actions/tags';
import SpinnerLoader from '@/components/spinner-loader';
import { Button } from '@/components/ui/button';
import QuerySearchForm from '@/features/admin/notes/search-form';
import NoteTable from '@/features/admin/notes/table';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { toOption } from '@/utils/format-utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

interface NotePageProps {
  searchParams?: Promise<Partial<QueryNote>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotesPage = async (props: NotePageProps) => {
  const categories = await getCategories();
  const tags = await getTags();

  const categoryOptions = toOption(categories);
  const tagOptions = toOption(tags);

  const searchParams = await props.searchParams;
  const queryRequest = coerceQueryNote.parse(searchParams);
  console.log('queryRequest', queryRequest);
  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">筆記管理</h1>

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
        defaultValues={{ ...defaultQueryNoteValues, ...queryRequest }}
      />

      {/* Notes Table Section */}
      {/* <Suspense fallback={<SpinnerLoader />} key={getUpdatedSearchParams(queryRequest).toString()}>
      </Suspense> */}
      <NoteTable queryRequest={queryRequest} />
    </div>
  );
};

export default NotesPage;
