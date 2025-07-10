'use client';
import ReactTable from '@/components/react-table';
import columns from './data-columns';
import { TableId } from '@/enums/table';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { TableCategory } from '@/actions/categories/types';
import { deleteCategoryById } from '@/actions/categories';

interface CategoryTableProps {
  data: TableCategory[];
  totalCount: number;
}

const CategoryTable: FC<CategoryTableProps> = ({ data, totalCount }) => {
  const { openAlertModal } = useAlertModal();

  // 刪除筆記
  const deleteCategoryMutation = useMutation({
    mutationFn: mutationHandler(deleteCategoryById),
    meta: {
      successMessage: { title: '筆記刪除成功' },
      shouldRefresh: true,
    },
  });

  const onDataDelete = (data: TableCategory) => {
    openAlertModal({
      title: `刪除類別 (名稱: ${data.name})`,
      status: 'warning',
      description: (
        <>
          <span>確定要刪除此類別嗎？</span>
          <br />
          <span>類別內容將會被刪除，並且無法復原，請謹慎操作。</span>
        </>
      ),
      confirmText: '確定刪除',
      cancelText: '取消',
      onConfirm: () => deleteCategoryMutation.mutate(data.id),
    });
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">類別列表</h1>
      <ReactTable
        data={data}
        columns={columns}
        totalElements={totalCount}
        manualPagination
        manualSorting
        pinningColumns={[TableId.Number, TableId.Editor]}
        meta={{ onDataDelete }}
      />
    </div>
  );
};

export default CategoryTable;
