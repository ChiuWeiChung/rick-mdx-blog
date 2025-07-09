'use client';
import ReactTable from '@/components/react-table';
import columns from './data-columns';
import { TableId } from '@/enums/table';
import { FC } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { mutationHandler } from '@/utils/react-query-handler';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { TableCategory,  } from '@/actions/categories/types';

interface CategoryTableProps {
  data: TableCategory[];
  totalCount: number;
}

const CategoryTable:FC<CategoryTableProps> = ({ data, totalCount }) => {
  const { openAlertModal } = useAlertModal();

  // // 刪除筆記
  // const { mutate: deleteNoteMutation } = useMutation({
  //   mutationFn: mutationHandler(deleteNote),
  //   meta: {
  //     successMessage: { title: '筆記刪除成功' },
  //     shouldRefresh: true,
  //   },
  // });
  
  // // 更新筆記的 visible 狀態
  // const { mutate: updateNoteVisibleMutation } = useMutation({
  //   mutationFn: mutationHandler(updateNoteVisible),
  //   meta: {
  //     successMessage: { title: '更新筆記狀態成功' },
  //     shouldRefresh: true,
  //   },
  // });

  const onModalOpen = (data: TableCategory) => {
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
      // onConfirm: () => deleteNoteMutation(data.id),
    });
  };

  const onDataEdit = (data: TableCategory) => {
    console.log('data', data);
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
        meta={{ onModalOpen, onDataEdit }}
      />
    </div>
  );
};

export default CategoryTable;
