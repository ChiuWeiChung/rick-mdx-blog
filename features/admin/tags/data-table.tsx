'use client';
import ReactTable from '@/components/react-table';
import columns from './data-columns';
import { TableId } from '@/enums/table';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { TableTag } from '@/actions/tags/types';
import { deleteTagById } from '@/actions/tags';

interface TagTableProps {
  data: TableTag[];
  totalCount: number;
}

const TagTable: FC<TagTableProps> = ({ data, totalCount }) => {
  const { openAlertModal } = useAlertModal();

  // 刪除筆記
  const deleteTagMutation = useMutation({
    mutationFn: mutationHandler(deleteTagById),
    meta: {
      successMessage: { title: '標籤刪除成功' },
      shouldRefresh: true,
    },
  });

  const onDataDelete = (data: TableTag) => {
    openAlertModal({
      title: `刪除標籤 (名稱: ${data.name})`,
      status: 'warning',
      description: (
        <>
          <span>確定要刪除此標籤嗎？</span>
          <br />
          <span>標籤內容將會被刪除，並且無法復原，請謹慎操作。</span>
        </>
      ),
      confirmText: '確定刪除',
      cancelText: '取消',
      onConfirm: () => deleteTagMutation.mutate(data.id),
    });
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">標籤列表</h1>
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

export default TagTable;
