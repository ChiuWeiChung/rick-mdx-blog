'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { TableId } from '@/enums/table';
import { TableCategory, tableCategoryKeys } from '@/actions/categories/types';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import Image from 'next/image';

const { accessor, display } = createColumnHelper<TableCategory>();
const isBrowser = () => typeof window !== 'undefined';

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
    cell: ({ getValue }) => {
      const name = getValue();
      return <span className="font-bold">{name}</span>;
    },
    size: 200,
  }),
  accessor(tableCategoryKeys.coverPath, {
    header: '封面',
    cell: ({ getValue }) => {
      const coverPath = getValue();
      if(!isBrowser()) return null;
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
              placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAcHBwcIBwgJCQgMDAsMDBEQDg4QERoSFBIUEhonGB0YGB0YJyMqIiAiKiM+MSsrMT5IPDk8SFdOTldtaG2Pj8ABBwcHBwgHCAkJCAwMCwwMERAODhARGhIUEhQSGicYHRgYHRgnIyoiICIqIz4xKysxPkg8OTxIV05OV21obY+PwP/CABEIAFoAoAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAAAQIDBAf/2gAIAQEAAAAA9a1qqdAwFKmZz59LqqbGApUzMcul1VMbAlJRMcul1TZQCSIzzWGlVbYAISjLMzurpsQIEowybunTBISUkc+Va6WNIlJJTMYZVvrQKVCQkpjHMd2BEZoq2pnLNc1t0phId3UxOayBtCACqlIP/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/2gAIAQIQAAAA7ACUCTndUiPO3qqkkVQgoP/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/2gAIAQMQAAAAwALAF65yKt7zOYLdEAAD/8QAHRAAAwEBAQADAQAAAAAAAAAAAQISEwMRABAgMP/aAAgBAQABAgAMGqqqvffv32qJ9LEhg1VVVVVVVVVVFiwYNQaqqqqqqqqixcsGDBqDVVVV3d3RcvdhgwYMGqqu7u6qixe7BDUGqqqqu7u7Z2e7BB9qqqqq7u9NG6M96Bg1VV3d3d3d6N0bppovQdNNNdNNd99tdNNNC5e7Hcd9999j3Pc9tth2HbTTU9S5ex2HbbYdj2PbbXXXYdh21PXU9T00/J/gPh+E/j//xAAbEAEBAAIDAQAAAAAAAAAAAABhAAEgEDBAcP/aAAgBAQADPwD5Eztjh6mZmZ5z1szq6Pt//8QAHREBAQABBAMAAAAAAAAAAAAAABEBAhASMCAhQP/aAAgBAgEBPwDqvTXJjUqqqqu3tcsalXwu0cXFPh//xAAcEQEBAAICAwAAAAAAAAAAAAAAEQESAhAgMED/2gAIAQMBAT8A9UTziNWqIiIid544Z4NUTqIiqvxf/9k="
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
  accessor(tableCategoryKeys.iconPath, {
    header: '圖示',
    cell: ({ getValue }) => {
      const iconPath = getValue();
      if (!isBrowser()) return null;
      if (!iconPath) return <span className="text-muted-foreground">尚無圖示</span>;
      const src = `${window.location.origin}/api/image?key=${iconPath}`;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={src}
              alt="cover"
              width={32}
              height={32}
              placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAcHBwcIBwgJCQgMDAsMDBEQDg4QERoSFBIUEhonGB0YGB0YJyMqIiAiKiM+MSsrMT5IPDk8SFdOTldtaG2Pj8ABBwcHBwgHCAkJCAwMCwwMERAODhARGhIUEhQSGicYHRgYHRgnIyoiICIqIz4xKysxPkg8OTxIV05OV21obY+PwP/CABEIAFoAoAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAAAQIDBAf/2gAIAQEAAAAA9a1qqdAwFKmZz59LqqbGApUzMcul1VMbAlJRMcul1TZQCSIzzWGlVbYAISjLMzurpsQIEowybunTBISUkc+Va6WNIlJJTMYZVvrQKVCQkpjHMd2BEZoq2pnLNc1t0phId3UxOayBtCACqlIP/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/2gAIAQIQAAAA7ACUCTndUiPO3qqkkVQgoP/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/2gAIAQMQAAAAwALAF65yKt7zOYLdEAAD/8QAHRAAAwEBAQADAQAAAAAAAAAAAQISEwMRABAgMP/aAAgBAQABAgAMGqqqvffv32qJ9LEhg1VVVVVVVVVVFiwYNQaqqqqqqqqixcsGDBqDVVVV3d3RcvdhgwYMGqqu7u6qixe7BDUGqqqqu7u7Z2e7BB9qqqqq7u9NG6M96Bg1VV3d3d3d6N0bppovQdNNNdNNd99tdNNNC5e7Hcd9999j3Pc9tth2HbTTU9S5ex2HbbYdj2PbbXXXYdh21PXU9T00/J/gPh+E/j//xAAbEAEBAAIDAQAAAAAAAAAAAABhAAEgEDBAcP/aAAgBAQADPwD5Eztjh6mZmZ5z1szq6Pt//8QAHREBAQABBAMAAAAAAAAAAAAAABEBAhASMCAhQP/aAAgBAgEBPwDqvTXJjUqqqqu3tcsalXwu0cXFPh//xAAcEQEBAAICAwAAAAAAAAAAAAAAEQESAhAgMED/2gAIAQMBAT8A9UTziNWqIiIid544Z4NUTqIiqvxf/9k="
              className="aspect-square w-[32px] rounded-md object-cover"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>路徑: {iconPath}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  }),
  accessor(tableCategoryKeys.postCount, {
    header: '文章數量',
    enableSorting: true,
  }),
];

export default columns;
