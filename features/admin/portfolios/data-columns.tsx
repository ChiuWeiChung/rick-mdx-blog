'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { isServer } from '@tanstack/react-query';
import { TableId } from '@/enums/table';
import { Portfolio } from '@/actions/portfolios/types';
import { Button } from '@/components/ui/button';
import { EditIcon, LinkIcon, TrashIcon } from 'lucide-react';
import { portfolioKeys } from '@/actions/portfolios/types';
import Link from 'next/link';
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import Image from 'next/image';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { placeholderDataUrl } from '@/constants/placeholder';

// const isBrowser = () => typeof window !== 'undefined';

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
  accessor(portfolioKeys.coverPath, {
    header: '封面',
    cell: ({ getValue }) => {
      const coverPath = getValue();
      if (isServer) return null;
      if (!coverPath) return <span className="text-muted-foreground">尚無封面</span>;
      const src = `${window.location.origin}/api/image?key=${coverPath}`;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={src}
              alt="cover"
              width={160}
              height={90}
              className="aspect-[16/9] w-[160px] rounded-md object-cover"
              placeholder={placeholderDataUrl}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>路徑: {coverPath}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    size: 180,
  }),
  accessor(portfolioKeys.description, {
    header: '描述',
    cell: ({ getValue }) => {
      const description = getValue();
      if (!description) return <span className="text-muted-foreground">尚無描述</span>;
      return (
        <p className="whitespace-pre-line rounded-md border bg-white p-2">{description}</p>
      );
    },
    size: 250,
  }),
  accessor(portfolioKeys.githubUrl, {
    header: 'Github 連結',
    cell: ({ getValue }) => {
      const url = getValue();
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={url} target="_blank" className="font-bold">
              <LinkIcon className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>路徑: {url}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  }),
  accessor(portfolioKeys.readmeUrl, {
    header: 'Readme 連結',
    cell: ({ getValue }) => {
      const url = getValue();
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={url} target="_blank" className="font-bold">
              <LinkIcon className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>路徑: {url}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  }),
  display({
    id: 'duration',
    header: '期間',
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      const endDate = row.original.endDate
        ? format(row.original.endDate, 'yy/MM/dd')
        : '至今';
      return (
        <span className="font-bold">
          {format(startDate, 'yy/MM/dd')} - {endDate}
        </span>
      );
    },
  }),
];

export default columns;
