'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { Switch } from '@/components/ui/switch';
import { TableId } from '@/enums/table';
import { type Note, NoteKeys } from '@/actions/notes/types';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';

const { accessor, display } = createColumnHelper<Note>();

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
      const { onModalOpen } = table.options.meta ?? {};

      const dataDeleteHandler = () => {
        onModalOpen?.(row.original);
      };

      return (
        <div className="flex gap-2">
          <Link href={`/admin/notes/editor?noteId=${row.original.id}`}>
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
  accessor(NoteKeys.title, {
    header: '文章標題',
    size: 200,
  }),
  display({
    id: NoteKeys.visible,
    header: '顯示',
    cell: ({ table, row }) => {
      const { onDataEdit } = table.options.meta ?? {};
      const onCheckedChange = (checked: boolean) => {
        onDataEdit?.({ ...row.original, visible: checked });
      };

      return <Switch checked={row.original.visible} onCheckedChange={onCheckedChange} />;
    },
    size: 150,
  }),
  // accessor(NoteKeys.username, {
  //   header: '作者',
  //   enableSorting: false,
  // }),
  accessor(NoteKeys.category, {
    header: '分類',
  }),
  accessor(NoteKeys.tags, {
    header: '標籤',
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="flex flex-wrap gap-2">
          {value.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
    size: 250,
  }),
  accessor(NoteKeys.createdAt, {
    header: '建立時間',
    cell: ({ getValue }) => {
      const value = getValue();
      return format(value, 'yy/MM/dd HH:mm');
    },
    size: 150,
  }),
  accessor(NoteKeys.updatedAt, {
    header: '更新時間',
    cell: ({ getValue }) => {
      const value = getValue();
      return format(value, 'yy/MM/dd HH:mm');
    },
    size: 150,
    enableSorting: true,
  }),
  accessor(NoteKeys.filePath, {
    header: '檔案路徑',
    size: 250,
  }),
];

export default columns;
