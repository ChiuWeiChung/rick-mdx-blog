import { getCategoryWithNoteCount } from '@/actions/categories';
import { QueryCategory, queryCategorySchema } from '@/actions/categories/types';
import QuerySearchForm from '@/features/admin/categories/search-form';
import CategoryEditor from '@/features/admin/categories/category-editor';
import CategoryTable from '@/features/admin/categories/table';
import React from 'react';

interface CategoriesPageProps {
  searchParams?: Promise<Partial<QueryCategory>>;
}

const CategoriesPage = async (props: CategoriesPageProps) => {
  const searchParams = await props.searchParams;
  const queryRequest = queryCategorySchema.parse(searchParams ?? {});

  const { data, totalCount } = await getCategoryWithNoteCount(queryRequest);

  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">類別管理</h1>
      <CategoryEditor />
      <QuerySearchForm defaultValues={queryRequest} />
      <CategoryTable data={data} totalCount={totalCount} />
    </div>
  );
};

export default CategoriesPage;
