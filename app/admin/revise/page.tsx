import ReviseTable from '@/features/admin/revise/data-table';
import { getNoteMemoList } from '@/actions/note-memos';
import React from 'react';
import { queryNoteMemoSchema } from '@/actions/note-memos/types';
import PageHeader from '@/components/page-header';

interface RevisePageProps {
  searchParams: Promise<{
    postId?: string;
  }>;
}

const RevisePage = async (props: RevisePageProps) => {
  const searchParams = await props.searchParams;
  const queryRequest = queryNoteMemoSchema.parse(searchParams ?? {});
  const { data, totalCount } = await getNoteMemoList(queryRequest);

  return (
    <>
      <PageHeader>修訂建議管理</PageHeader>

      {/* 表格 */}
      <ReviseTable data={data} totalCount={totalCount} />
    </>
  );
};  

export default RevisePage;
