import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React from 'react';

interface SpinnerLoaderProps {
  className?: string;
}

const SpinnerLoader = ({ className }: SpinnerLoaderProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader className={cn('h-20 w-20 text-primary animate-spin', className)} />
    </div>
  );
};

export default SpinnerLoader;
