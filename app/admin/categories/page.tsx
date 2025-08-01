import { getCategoryWithNoteCount } from '@/actions/categories';
import { QueryCategory, queryCategorySchema } from '@/actions/categories/types';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/page-header';
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
    <>
      <PageHeader>類別管理</PageHeader>
      <div className="my-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* 搜尋 */}
        <QuerySearchForm defaultValues={queryRequest} />

        {/* 新增 */}
        <Link href={`/admin/categories/editor`} className="w-fit self-end -order-1 md:order-last">
          <Button>
            <Plus />
            新增類別
          </Button>
        </Link>
      </div>

      {/* 表格 */}
      <CategoryTable data={data} totalCount={totalCount} />
    </>
  );
};

export default CategoriesPage;
