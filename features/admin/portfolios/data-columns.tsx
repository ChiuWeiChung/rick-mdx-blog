'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { TableId } from '@/enums/table';
import { Portfolio } from '@/actions/portfolios/types';
import { Button } from '@/components/ui/button';
import { EditIcon, LinkIcon, TrashIcon } from 'lucide-react';
import { portfolioKeys } from '@/actions/portfolios/types';
import Link from 'next/link';
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import Image from 'next/image';
import { format } from 'date-fns';

const { accessor, display } = createColumnHelper<Portfolio>();

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
          <Link href={`/admin/portfolios/editor?portfolioId=${row.original.id}`}>
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
  accessor(portfolioKeys.projectName, {
    header: '專案名稱',
    cell: ({ getValue }) => {
      const name = getValue();
      return <span className="font-bold">{name}</span>;
    },
    size: 200,
  }),
  accessor(portfolioKeys.githubUrl, {
    header: 'Github 連結',
    cell: ({ getValue }) => {
      const url = getValue();
      return (
        <Link href={url} target="_blank" className="font-bold">
          <LinkIcon className="h-4 w-4" />
        </Link>
      );
    },
  }),
  accessor(portfolioKeys.readmeUrl, {
    header: 'Readme 連結',
    cell: ({ getValue }) => {
      const url = getValue();
      return (
        <Link href={url} target="_blank" className="font-bold">
          <LinkIcon className="h-4 w-4" />
        </Link>
      );
    },
  }),
  display({
    id: 'duration',
    header: '期間',
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      const endDate = row.original.endDate ? format(row.original.endDate, 'yyyy/MM/dd') : 'On Going';
      return <span className="font-bold">{format(startDate, 'yyyy/MM/dd')} - {endDate}</span>;
    },
  }),
];

export default columns;
