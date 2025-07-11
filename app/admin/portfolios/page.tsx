import QuerySearchForm from '@/features/admin/tags/search-form';
import TagTable from '@/features/admin/tags/data-table';
import React from 'react';
import { QueryTag, queryTagSchema } from '@/actions/tags/types';
import { getTagWithNoteCount } from '@/actions/tags';

interface TagsPageProps {
  searchParams?: Promise<Partial<QueryTag>>;
}

const TagsPage = async (props: TagsPageProps) => {
  const searchParams = await props.searchParams;
  const queryRequest = queryTagSchema.parse(searchParams ?? {});
  const { data, totalCount } = await getTagWithNoteCount(queryRequest);

  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">標籤管理</h1>
	  
      {/* 搜尋 */}
      <QuerySearchForm defaultValues={queryRequest} />

      {/* 表格 */}
      <TagTable data={data} totalCount={totalCount} />
    </div>
  );
};

export default TagsPage;
