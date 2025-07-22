'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { TableId } from '@/enums/table';
import { TableNoteMemo, tableNoteMemoKeys } from '@/actions/note-memos/types';
import { Button } from '@/components/ui/button';
import {  EditIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const { accessor, display } = createColumnHelper<TableNoteMemo>();

const columns = [
  display({
    id: TableId.Number,
    header: 'No.',
    size: 60,
  }),

  display({
    id: TableId.Editor,
    header: '操作',
    cell: ({ table, row }) => {
      const { onDataDelete } = table.options.meta ?? {};

      const dataDeleteHandler = () => {
        onDataDelete?.(row.original);
      };

      return (
        <div className="flex gap-2">
          <Link href={`/admin/notes/editor?noteId=${row.original.postId}`}>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 justify-center text-neutral-800"
            >
              <EditIcon />
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="icon"
            className="text-destructive h-8 w-8 justify-center"
            onClick={dataDeleteHandler}
          >
            <TrashIcon />
          </Button>
        </div>
      );
    },
  }),
  accessor(tableNoteMemoKeys.postTitle, {
    header: '筆記標題',
  }),
  accessor(tableNoteMemoKeys.selectedContent, {
    header: '選取內容',
    cell: ({ getValue }) => {
      const name = getValue();
      return <p className="font-bold text-ellipsis whitespace-nowrap overflow-hidden">{name}</p>;
    },
    size: 350,
  }),
  accessor(tableNoteMemoKeys.content, {
    header: '建議內容',
    cell: ({ getValue }) => {
      const name = getValue();
      return <p className="font-bold text-ellipsis whitespace-nowrap overflow-hidden">{name}</p>;
    },
    size: 350,
  }),
  // accessor(tableNoteMemoKeys.blockId, {
  //   header: '區塊 ID',
  // }),
  // accessor(tableNoteMemoKeys.startOffset, {
  //   header: '開始偏移量 (字元)',
  // }),
  // accessor(tableNoteMemoKeys.endOffset, {
  //   header: '結束偏移量 (字元)',
  // }),
  accessor(tableNoteMemoKeys.createdAt, {
    header: '建立時間',
    enableSorting: true,
    cell: ({ getValue }) => {
      const createdAt = getValue();
      return <span className="font-bold">{format(createdAt, 'yyyy/MM/dd HH:mm')}</span>;
    },
  }),
];

export default columns;
