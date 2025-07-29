import { cn } from '@/lib/utils';
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className }: PageWrapperProps) => {
  return (  
    <div className={cn('container mx-auto flex flex-col items-center px-4 py-8 gap-4 animate-fade', className)}>
      {children}
    </div>
  );
};

export default PageWrapper;
