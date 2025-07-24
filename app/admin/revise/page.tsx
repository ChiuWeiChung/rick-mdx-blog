import ReviseTable from '@/features/admin/revise/data-table';
import { getNoteMemoList } from '@/actions/note-memos';
import React from 'react';
import { defaultQueryNoteMemoValues, queryNoteMemoSchema } from '@/actions/note-memos/types';
import PageHeader from '@/components/page-header';
import QuerySearchForm from '@/features/admin/revise/search-form';
import { getNoteOptions } from '@/actions/notes';

interface RevisePageProps {
  searchParams: Promise<{
    postId?: string;
  }>;
}

const RevisePage = async (props: RevisePageProps) => {
  const searchParams = await props.searchParams;
  const queryRequest = queryNoteMemoSchema.parse(searchParams ?? {});
  const { data, totalCount } = await getNoteMemoList(queryRequest);
  // 取得筆記標題
  const noteOptions = await getNoteOptions();
  return (
    <>
      <PageHeader>修訂建議管理</PageHeader>
      {/* 搜尋 */}
      <QuerySearchForm
        defaultValues={{ ...defaultQueryNoteMemoValues, ...queryRequest }}
        noteOptions={noteOptions}
      />
      {/* 表格 */}
      <ReviseTable data={data} totalCount={totalCount} />
    </>
  );
};  

export default RevisePage;
