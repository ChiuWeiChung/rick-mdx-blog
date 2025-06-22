'use client';
import { useSidebar } from '@/components/ui/sidebar';
import { SIDEBAR_WIDTH } from '@/constants/sidebar';
import React from 'react';

interface PageContentProps {
  children: React.ReactNode;
}

const PageContent = ({ children }: PageContentProps) => {
  const { open, isMobile } = useSidebar();
  const calculateMaxWidth = () => {
    // 1. 如果 isMobile 為 true 或 open 為 false，則 maxWidth 為 100%
    // 2. 如果 isMobile 為 false 且 open 為 true，則 maxWidth 為 calc(100% - 256px)
    return isMobile || !open ? '100%' : `calc(100% - ${SIDEBAR_WIDTH})`;
  };

  return (
    <main className="flex-1 p-4" style={{ maxWidth: calculateMaxWidth() }}>
      {children}
    </main>
  );
};

export default PageContent;
