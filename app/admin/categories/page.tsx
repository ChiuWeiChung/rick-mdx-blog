import { getCategoryWithNoteCount } from '@/actions/categories';
import { QueryCategory, queryCategorySchema } from '@/actions/categories/types';
import { Button } from '@/components/ui/button';
import QuerySearchForm from '@/features/admin/categories/search-form';
import CategoryTable from '@/features/admin/categories/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
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
      {/* <CategoryEditor /> */}
      {/* <Button type="button" className="w-fit self-end">
      </Button> */}
      <div className="flex items-center justify-between">
        <QuerySearchForm defaultValues={queryRequest} />
        <Link href={`/admin/categories/editor`} className="w-fit self-end">
          <Button>
            <Plus />
            新增類別
          </Button>
        </Link>
      </div>
      <CategoryTable data={data} totalCount={totalCount} />
    </div>
  );
};

export default CategoriesPage;
