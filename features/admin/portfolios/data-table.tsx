'use client';
import ReactTable from '@/components/react-table';
import columns from './data-columns';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { Portfolio } from '@/actions/portfolios/types';
import { deletePortfolioById } from '@/actions/portfolios';

interface PortfolioTableProps {
  data: Portfolio[];
  totalCount: number;
}

const PortfolioTable: FC<PortfolioTableProps> = ({ data, totalCount }) => {
  const { openAlertModal } = useAlertModal();

  // 刪除
  const deletePortfolioMutation = useMutation({
    mutationFn: mutationHandler(deletePortfolioById),
    meta: {
      successMessage: { title: '筆記刪除成功' },
      shouldRefresh: true,
    },
  });

  const onDataDelete = (data: Portfolio) => {
    openAlertModal({
      title: `刪除作品 (名稱: ${data.projectName})`,
      status: 'warning',
      description: <span>確定要在資料庫中刪除此作品嗎？</span>,
      confirmText: '確定刪除',
      cancelText: '取消',
      onConfirm: () => deletePortfolioMutation.mutate(data.id),
    });
  };

  return (
    <ReactTable
      caption="作品列表"
      data={data}
      columns={columns}
      totalElements={totalCount}
      meta={{ onDataDelete }}
    />
  );
};

export default PortfolioTable;
