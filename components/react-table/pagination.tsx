'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Table } from '@tanstack/react-table';

export interface PaginationProps<T> {
	table: Table<T>;
	// currentPage: number;
	// totalPage: number;
	className?: string;
	showPagination?: boolean;
	totalElements: number;
	paginateByServer?: (pagination: { page: number; limit: number }) => void;
}

export default function Pagination<T>({
	table,
	// totalPage,
	className,
	showPagination = true,
	totalElements,
	paginateByServer,
}: PaginationProps<T>) {
	const [inputPage, setInputPage] = useState('1');
	const inputRef = useRef<HTMLInputElement>(null);
	const { pageIndex, pageSize } = table.getState().pagination;
	const totalPage = Math.ceil(totalElements / pageSize);

	const handlePagination = ({ type }: { type: 'prev' | 'next' | 'first' | 'last' }) => {
		if (type === 'prev') {
			table.previousPage();
			setInputPage(prev => {
				return (Number(prev) - 1).toString();
			});
		}
		if (type === 'next') {
			table.nextPage();
			setInputPage(prev => {
				return (Number(prev) + 1).toString();
			});
		}
		if (type === 'first') {
			table.firstPage();
			setInputPage('1');
		}
		if (type === 'last') {
			if (paginateByServer) {
				table.setPageIndex(totalPage - 1);
			} else table.lastPage();
			setInputPage(totalPage.toString());
		}
	};

	const handleInputPagination = (e: React.ChangeEvent<HTMLInputElement>) => {
		const pageValue = e.target.value;
		const regex = /^[1-9]\d*$/;

		// 可以整個刪除 input，用於顯示 placeholder。
		// 不得輸入開頭為 0，小數點，大於總頁數
		if (pageValue.length === 0 || (regex.test(pageValue) && Number(pageValue) <= totalPage)) {
			setInputPage(pageValue);
		}
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
		inputRef.current?.blur();
		const page = pageIndex + 1;
		const selectedPage = inputPage.length <= 0 ? page.toString() : inputPage;
		setInputPage(selectedPage);
		table.setPageIndex(Number(selectedPage) - 1);
	};

	// const currentPageSizeValue = tablePageSizeOptions.find((opt) => {
	//   return opt.value === pageSize;
	// });

	const disabledNextPage = useMemo(() => {
		return paginateByServer ? pageIndex + 1 >= totalPage : !table.getCanNextPage();
	}, [table, pageIndex, paginateByServer, totalPage]);

	const disabledLastPage = useMemo(() => {
		return paginateByServer ? pageIndex + 1 >= totalPage : !table.getCanNextPage();
	}, [table, pageIndex, paginateByServer, totalPage]);

	useEffect(() => {
		if (paginateByServer) {
			paginateByServer({ page: pageIndex + 1, limit: pageSize });
			setInputPage(String(pageIndex + 1));
		}
	}, [pageIndex, pageSize, paginateByServer]);

	return (
		<div
			className={cn('flex items-center gap-10', showPagination ? 'justify-center' : 'justify-end')}
		>
			{showPagination ? (
				<ul className={cn('flex justify-center gap-2', className)}>
					<PageItem
						handlePagination={() => {
							handlePagination({ type: 'first' });
						}}
						disabled={!table.getCanPreviousPage()}
						render={<ChevronsLeft size={24} aria-label="first page" />}
					/>
					<PageItem
						handlePagination={() => {
							handlePagination({ type: 'prev' });
						}}
						disabled={!table.getCanPreviousPage()}
						render={<ChevronLeft size={24} aria-label="previous page" />}
					/>

					{/* ex: ..., 3, 4, 5, 6, ... */}
					{pageIndex + 1 > 3 && <EllipsisButton />}

					{[...new Array(totalPage).keys()].map((_, index) => {
						/**
						 * 小於等於 5頁，顯示全頁碼
						 * ex: 1, 2, 3, 4, 5
						 * 大於 5頁顯示 ...
						 * ex: 1, 2, 3, 4, ...
						 * ex: ..., 4, 5, 6, ...
						 */
						const page = pageIndex + 1;
						const pageItem = index + 1;
						const isOnlyFivePage = totalPage === 5;
						const isNearFirstPage = page <= 3 && pageItem < 5;
						const isNearLastPage = page >= totalPage - 2 && pageItem >= totalPage - 3;
						const isMiddlePage =
							pageItem === page || pageItem === page + 1 || pageItem === page - 1;

						// 顯示條件：如果只有五頁、靠近前端的頁碼、靠近末尾的頁碼、目前的前一頁和後一頁
						const displayItem = isOnlyFivePage || isNearFirstPage || isNearLastPage || isMiddlePage;

						return displayItem ? (
							<PageItem
								key={pageItem}
								handlePagination={() => {
									table.setPageIndex(pageItem - 1);
									setInputPage(pageItem.toString());
								}}
								isCurrentPage={page === pageItem}
								render={pageItem}
							/>
						) : null;
					})}

					{/* ex: ..., 3, 4, 5, 6, ... */}
					{pageIndex + 1 < totalPage - 2 && totalPage > 5 && <EllipsisButton />}

					<PageItem
						handlePagination={() => {
							handlePagination({ type: 'next' });
						}}
						// disabled={!table.getCanNextPage()}
						disabled={disabledNextPage}
						render={<ChevronRight size={24} aria-label="next page" />}
					/>
					<PageItem
						handlePagination={() => {
							handlePagination({ type: 'last' });
						}}
						// disabled={!table.getCanNextPage()}
						disabled={disabledLastPage}
						render={<ChevronsRight size={24} aria-label="last page" />}
					/>
				</ul>
			) : null}

			<div className={cn('flex items-center', showPagination ? '' : 'pt-2')}>
				<p className="text-nowrap whitespace-nowrap">當前頁：</p>
				<Input
					ref={inputRef}
					placeholder={`1 - ${totalPage.toString()}`}
					value={inputPage}
					onChange={handleInputPagination}
					onKeyDown={onKeyDown}
					className="w-12 px-1 py-0 text-center"
				/>
			</div>
		</div>
	);
}

function EllipsisButton() {
	return (
		<li className="h-10 w-10">
			<div
				className={cn(
					buttonVariants({ size: 'icon', variant: 'secondary' }),
					'bg-transparent text-neutral-950'
				)}
			>
				<Ellipsis />
			</div>
		</li>
	);
}

type PageItemProps = {
	isCurrentPage?: boolean;
	handlePagination: () => void;
	disabled?: boolean;
	render: React.ReactNode | string;
};

function PageItem({ isCurrentPage, handlePagination, disabled, render }: PageItemProps) {
	return (
		<li className="h-10 w-10">
			<Button
				size="icon"
				variant={isCurrentPage ? 'default' : 'ghost'}
				onClick={handlePagination}
				disabled={disabled}
				type="button"
				className={isCurrentPage ? 'bg-primary-light text-primary hover:bg-primary-light' : ''}
			>
				{render}
			</Button>
		</li>
	);
}
