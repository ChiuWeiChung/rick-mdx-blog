'use client';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { getUpdatedSearchParams } from '@/utils/form-utils';

export interface ServerPaginationProps {
  className?: string;
  totalElements: number;
  scrollToTopOnPageChange?: boolean;
}

export default function ServerPagination({ className,  totalElements, scrollToTopOnPageChange }: ServerPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageSize = Number(searchParams.get('limit') ?? '10');
  const currentPage = Number(searchParams.get('page') ?? '1');
  const totalPages = Math.ceil(totalElements / pageSize);

  if (totalPages <= 1) return null;

  // 構建 URL 的輔助函數
  const buildUrl = (page: number) => {
    const param = getUpdatedSearchParams({ page }, searchParams);
    return `${pathname}?${param.toString()}`;
  };

  // 生成要顯示的頁碼數組
  const getPageNumbers = () => {  
    const delta = 2; // 當前頁面前後顯示的頁數
    const pages: (number | 'ellipsis')[] = [];

    // 如果總頁數較少，顯示所有頁碼
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 總是包含第一頁
    pages.push(1);

    // 計算當前頁面周圍的範圍
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // 如果開始頁碼大於 2，添加省略號
    if (start > 2) {
      pages.push('ellipsis');
    }

    // 添加中間的頁碼
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 如果結束頁碼小於倒數第二頁，添加省略號
    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    // 總是包含最後一頁（如果不是第一頁）
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn('mt-2', className)}>
      <PaginationContent>
        {/* 上一頁按鈕 */}
        <PaginationItem>
          <PaginationPrevious
            scroll={scrollToTopOnPageChange}
            href={currentPage > 1 ? buildUrl(currentPage - 1) : buildUrl(currentPage)}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* 動態生成頁碼按鈕 */}
        {pageNumbers.map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={buildUrl(pageNum)}
                isActive={pageNum === currentPage}
                scroll={scrollToTopOnPageChange}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* 下一頁按鈕 */}
        <PaginationItem>
          <PaginationNext
            scroll={scrollToTopOnPageChange}
            href={currentPage < totalPages ? buildUrl(currentPage + 1) : buildUrl(currentPage)}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
