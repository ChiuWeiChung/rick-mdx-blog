import QuerySearchForm from '@/features/admin/tags/search-form';
import TagTable from '@/features/admin/tags/data-table';
import React from 'react';
import { QueryTag, queryTagSchema } from '@/actions/tags/types';
import { getTagWithNoteCount } from '@/actions/tags';
import PageHeader from '@/components/page-header';

interface TagsPageProps {
  searchParams?: Promise<Partial<QueryTag>>;
}

const TagsPage = async (props: TagsPageProps) => {
  const searchParams = await props.searchParams;
  const queryRequest = queryTagSchema.parse(searchParams ?? {});
  const { data, totalCount } = await getTagWithNoteCount(queryRequest);

  return (
    <>
      <PageHeader>標籤管理</PageHeader>
	  
      {/* 搜尋 */}
      <QuerySearchForm defaultValues={queryRequest} />

      {/* 表格 */}
      <TagTable data={data} totalCount={totalCount} />
    </>
  );
};

export default TagsPage;
