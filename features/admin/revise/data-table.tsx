'use client';
import ReactTable from '@/components/react-table';
import columns from './data-columns';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { deleteNoteMemo } from '@/actions/note-memos';
import { NoteMemo, TableNoteMemo } from '@/actions/note-memos/types';

interface ReviseTableProps {
  data: TableNoteMemo[];
  totalCount: number;
}

const ReviseTable: FC<ReviseTableProps> = ({ data, totalCount }) => {
  const { openAlertModal } = useAlertModal();

  // 刪除
  const deletePortfolioMutation = useMutation({
    mutationFn: mutationHandler(deleteNoteMemo),
    meta: {
      successMessage: { title: '修訂建議刪除成功' },
      shouldRefresh: true,
    },
  });

  const onDataDelete = (data: NoteMemo) => {
    openAlertModal({
      title: `刪除修訂建議 (內容: ${data.content})`,
      status: 'warning',
      description: <span>確定要在資料庫中刪除此修訂建議嗎？</span>,
      confirmText: '確定刪除',
      cancelText: '取消',
      onConfirm: () => deletePortfolioMutation.mutate(data.id),
    });
  };

  return (
    <ReactTable
      caption="修訂建議列表"
      data={data}
      columns={columns}
      totalElements={totalCount}
      manualPagination
      manualSorting
      meta={{ onDataDelete }}
    />
  );
};

export default ReviseTable;
