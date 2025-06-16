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
	columns: ColumnDef<T, unknown>[];
	data?: T[];
	meta?: TableMeta<T>;
	isLoading?: boolean;
	limit?: number;
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
	paginateByServer?: (pagination: { page: number; limit: number }) => void;
	manualPagination?: boolean;
	manualSorting?: boolean;
	sortByServer?: (sorting: SortingState) => void;
}

export interface PaginationState {
	pageIndex: number;
	pageSize: number;
}
