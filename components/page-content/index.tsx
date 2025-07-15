'use client';
import { useSidebar } from '@/components/ui/sidebar';
import { SIDEBAR_WIDTH } from '@/constants/sidebar';
import { cn } from '@/lib/utils';
import React from 'react';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

const PageContent = ({ children, className }: PageContentProps) => {
  const { open, isMobile } = useSidebar();
  const calculateMaxWidth = () => {
    // 1. 如果 isMobile 為 true 或 open 為 false，則 maxWidth 為 100%
    // 2. 如果 isMobile 為 false 且 open 為 true，則 maxWidth 為 calc(100% - 256px)
    return isMobile || !open ? '100%' : `calc(100% - ${SIDEBAR_WIDTH})`;
  };

  return (
    // <main
    //   className={cn(
    //     'relative z-10 min-h-screen flex-1 rounded bg-gradient-to-b from-slate-50 to-slate-200 shadow-inner dark:from-gray-900 dark:to-gray-950',
    //     className
    //   )}
    //   style={{ maxWidth: calculateMaxWidth() }}
    // >
    <main className={cn("relative flex-1", className)} style={{ maxWidth: calculateMaxWidth() }}>
      {children}
    </main>
  );
};

export default PageContent;
