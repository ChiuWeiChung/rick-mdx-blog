import {
	type Row,
	type ColumnDef,
	type TableMeta,
	type VisibilityState,
	type SortingState,
} from '@tanstack/react-table';
import { type ReactElement, type HTMLAttributes } from 'react';
import { type Control } from 'react-hook-form';

export interface ReactTableProps<T> {
  className?: HTMLAttributes<HTMLElement>['className'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data?: T[];
  meta?: TableMeta<T>;
  isLoading?: boolean;
  currentLimit?: number;
  currentPage?: number;
  // totalPage?: number;
  headerHide?: boolean;
  renderSubComponent?: (props: { row: Row<T> }) => ReactElement;
  control?: Control;
  visibilityState?: VisibilityState;
  showPagination?: boolean;
  enableRowSelection?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (updater: unknown) => void;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  totalElements?: number;
  pinningColumns?: string[];
  manualPagination?: boolean;
  manualSorting?: boolean;
  sortByServer?: (sorting: SortingState) => void;
}

export interface PaginationState {
	pageIndex: number;
	pageSize: number;
}
