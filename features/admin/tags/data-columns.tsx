'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { TableId } from '@/enums/table';
import { TableTag, tableTagKeys } from '@/actions/tags/types';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const { accessor, display } = createColumnHelper<TableTag>();

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
          <Link href={`/admin/tags/editor?tagId=${row.original.id}`}>
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
  accessor(tableTagKeys.name, {
    header: '標籤名稱',
    cell: ({ getValue }) => {
      const name = getValue();
      return <Badge variant="outline" className="font-bold">{name}</Badge>;
    },
    size: 200,
  }),
  accessor(tableTagKeys.postCount, {
    header: '文章數量',
    enableSorting: true,
  }),
];

export default columns;
