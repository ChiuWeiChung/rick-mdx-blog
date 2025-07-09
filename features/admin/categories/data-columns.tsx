'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { TableId } from '@/enums/table';
import { TableCategory, tableCategoryKeys } from '@/actions/categories/types';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

const { accessor, display } = createColumnHelper<TableCategory>();

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
          <Link href={`/admin/categories/editor?categoryId=${row.original.id}`}>
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
  accessor(tableCategoryKeys.name, {
    header: '類別名稱',
    size: 200,
  }),
  accessor(tableCategoryKeys.coverPath, {
    header: '封面路徑',
    size: 250,
  }),
  accessor(tableCategoryKeys.iconPath, {
    header: '圖示路徑',
    size: 250,
  }),
  accessor(tableCategoryKeys.postCount, {
    header: '文章數量',
    enableSorting: true,
  }),
];

export default columns;
