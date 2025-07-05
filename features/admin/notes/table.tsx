'use client';
import ReactTable from '@/components/react-table';
import columns from './table-columns';
import {  Note, NoteKeys } from '@/actions/notes/types';
import { TableId } from '@/enums/table';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { deleteNote, updateNoteVisible } from '@/actions/notes';
import { toast } from 'sonner';
import { useAlertModal } from '@/hooks/use-alert-modal';

interface NoteTableProps {
  data: Note[];
  totalCount: number;
}

const NoteTable:FC<NoteTableProps> = ({ data, totalCount }) => {
  const { openAlertModal } = useAlertModal();

  // 刪除筆記
  const { mutate: deleteNoteMutation } = useMutation({
    mutationFn: mutationHandler(deleteNote),
    meta: {
      successMessage: { title: '筆記刪除成功' },
      shouldRefresh: true,
    },
  });
  
  // 更新筆記的 visible 狀態
  const { mutate: updateNoteVisibleMutation } = useMutation({
    mutationFn: mutationHandler(updateNoteVisible),
    meta: {
      successMessage: { title: '更新筆記狀態成功' },
      shouldRefresh: true,
    },
  });

  const onModalOpen = (data: Note) => {
    openAlertModal({
      title: `刪除筆記 (標題: ${data.title})`,
      status: 'warning',
      description: (
        <>
          <span>確定要刪除這筆筆記嗎？</span>
          <br />
          <span>筆記內容將會被刪除，並且無法復原，請謹慎操作。</span>
        </>
      ),
      confirmText: '確定刪除',
      cancelText: '取消',
      onConfirm: () => deleteNoteMutation(data.id),
    });
  };

  const onDataEdit = (data: Note) => {
    updateNoteVisibleMutation({ noteId: data.id, visible: data.visible });
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">筆記列表</h1>
      <ReactTable
        data={data}
        columns={columns}
        totalElements={totalCount}
        manualPagination
        manualSorting
        pinningColumns={[TableId.Number, TableId.Editor, NoteKeys.title]}
        meta={{ onModalOpen, onDataEdit }}
      />
    </div>
  );
};

export default NoteTable;
