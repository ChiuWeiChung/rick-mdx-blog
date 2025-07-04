'use client';
import { Fragment, useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getExpandedRowModel,
  type PaginationState,
  getSortedRowModel,
  type Column,
  type SortingState,
} from '@tanstack/react-table';
import {
  TableRow,
  TableHead,
  TableCell,
  TableHeader,
  Table,
  TableBody,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CylinderIcon, MoveUp } from 'lucide-react';
import { TableId } from '@/enums/table';
import type { ReactTableProps } from './types';
import Pagination from './pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import LinkPagination from './link-pagination';
import { QueryOrder } from '@/enums/query';

const emptyData: unknown[] = [];

function ReactTable<T>({
  columns,
  data,
  meta,
  isLoading = false,
  totalElements = 0,
  currentLimit = 10,
  currentPage = 1,
  headerHide,
  renderSubComponent,
  visibilityState = {},
  className,
  showPagination = true,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  pinningColumns = undefined,
  manualPagination,
  manualSorting,
  onSortingChange,
}: ReactTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [columnVisibility, setColumnVisibility] = useState(visibilityState); // TODO 從 localStorage 存取既有設定
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: currentLimit,
  });

  const table = useReactTable({
    data: data ?? (emptyData as T[]),
    columns,
    getRowCanExpand: () => {
      return true;
    },
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(), // required
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableMultiSort: false, // 暫時關閉多欄排序
    state: {
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
      columnPinning: {
        left: pinningColumns,
      },
    },
    initialState: { pagination: { pageSize: currentLimit } }, // 預設 pageSize
    manualPagination,
    manualSorting,
    defaultColumn: { size: 120 }, // 預設 column 最大寬度為 140px
    meta,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: Boolean(rowSelection),
    getRowId,
  });
  const pageSize = table.getState().pagination.pageSize;
  const sortingState = table.getState().sorting;

  const tableSkeleton = useMemo(() => {
    const skeletonArray = new Array(pageSize).fill('skeleton').map((item: string, key: number) => {
      return `${item}_${String(key)}`;
    });
    return skeletonArray.map(skeletonKey => {
      return table.getHeaderGroups().map(headerGroup => {
        return (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              const size = header.getSize();
              const style = { width: size, maxWidth: size };
              return (
                <TableCell
                  className="animate-fade h-11 last:!w-full"
                  style={style}
                  key={`${skeletonKey}-${header.id}`}
                >
                  <Skeleton className="bg-secondary h-8" style={{ width: size * 0.85 }} />
                </TableCell>
              );
            })}
          </TableRow>
        );
      });
    });
  }, [pageSize, table]);

  const getCommonPinningStyles = (
    column: Column<T>,
    backgroundColor: string,
    rowClassName?: string
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');

    return {
      boxShadow: isLastLeftPinnedColumn ? '-4px 0 2px -4px gray inset' : undefined,
      left: isPinned === 'left' ? `${String(column.getStart('left'))}px` : undefined,
      outline: isPinned ? '0.2px solid lightgray' : undefined,
      // 暫時 hardcode 處理
      backgroundColor: rowClassName ? '#ffdbdb' : isPinned ? backgroundColor : '',
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 30 : undefined,
    };
  };

  useEffect(() => {
    if (manualSorting) {
      if (onSortingChange) onSortingChange(sortingState);
      else {
        // 因為 multiSorting 關閉，永遠只會有一個 sortBy 或是沒有排序
        const [{ id: sort, desc: isDesc } = {}] = sortingState;
        // 建立用於更新 URL 的參數物件
        const paramsObj = sort
          ? { sort, order: isDesc ? QueryOrder.DESC : QueryOrder.ASC }
          : { sort: undefined, order: undefined };
        // 取得更新後的 URLSearchParams
        const updatedParams = getUpdatedSearchParams(paramsObj, searchParams);
        // 導向到新的查詢字串
        router.push(`?${updatedParams.toString()}`, { scroll: false });
      }
    }
  }, [sortingState, onSortingChange, manualSorting]);

  return (
    <div
      className={cn('relative mx-auto flex w-full flex-col overflow-hidden rounded-sm', className)}
    >
      <Table aria-label="table" className="caption-top">
        {!headerHide && (
          <TableHeader className="sticky top-0 z-40 bg-neutral-600 shadow-lg">
            <>
              {table.getHeaderGroups().map(headerGroup => {
                return (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      const sortDirection = header.column.getIsSorted();
                      const buttonClassName = header.column.getCanSort() ? '' : '!cursor-default';
                      return (
                        <TableHead
                          className="border-none text-white"
                          style={{
                            ...getCommonPinningStyles(header.column, '#363538'),
                          }}
                          key={header.id}
                        >
                          <Button
                            variant={null}
                            type="button"
                            className={cn('min-w-0 justify-start p-0 text-sm', buttonClassName)}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {!header.isPlaceholder &&
                              flexRender(header.column.columnDef.header, header.getContext())}

                            {Boolean(sortDirection) && (
                              <MoveUp
                                className={cn(
                                  'ml-1 h-4 w-4 transition-transform duration-200 ease-in-out',
                                  sortDirection === 'desc' && 'rotate-180'
                                )}
                              />
                            )}
                          </Button>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                );
              })}
            </>
          </TableHeader>
        )}
        <TableBody>
          {isLoading
            ? tableSkeleton
            : table.getRowModel().rows.map((row, index) => {
                const rowBackgroundColor = index % 2 ? 'bg-neutral-0' : 'bg-neutral-100';
                let rowClassName = '';
                const assignRowClassName = table.options.meta?.assignRowClassName;
                if (assignRowClassName) {
                  rowClassName = assignRowClassName(row);
                }

                return (
                  <Fragment key={row.id}>
                    <TableRow className={cn(rowBackgroundColor, 'animate-fade', rowClassName)}>
                      {row.getVisibleCells().map(cell => {
                        const { size } = cell.column.columnDef;
                        const style = {
                          width: size,
                          minWidth: size,
                          maxWidth: size,
                        };
                        const contentComponent = !cell.id.includes(TableId.Number) ? (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        ) : (
                          <div className="font-bold">{index + 1}.</div>
                        );

                        return (
                          <TableCell
                            style={{
                              ...getCommonPinningStyles(
                                cell.column,
                                index % 2 ? '#ffffff' : '#e7e7e7',
                                rowClassName
                              ),
                              ...style,
                            }}
                            className="h-11 overflow-hidden text-nowrap whitespace-nowrap last:!w-full"
                            key={cell.id}
                          >
                            {contentComponent}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow>
                        {/* 2nd row is a custom 1 cell row */}
                        <TableCell colSpan={row.getVisibleCells().length} className="!p-0">
                          {renderSubComponent ? renderSubComponent({ row }) : null}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
          {!data?.length && !isLoading && <TableRow className="h-52" />}
        </TableBody>
      </Table>
      {!data?.length && !isLoading && (
        <div className="absolute bottom-0 left-1/2 mb-8 flex -translate-x-1/2 items-center justify-center gap-2">
          <CylinderIcon className="text-neutral h-10 w-10" />
          <p className="m-base text-neutral py-base text-3xl">查無資料</p>
        </div>
      )}

      {manualPagination ? (
        <LinkPagination showPagination={showPagination} totalElements={totalElements} />
      ) : (
        <div className="mt-2 flex items-center justify-center gap-4 pb-2">
          {data?.length && !isLoading ? (
            <Pagination
              table={table}
              showPagination={showPagination}
              totalElements={totalElements}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ReactTable;
