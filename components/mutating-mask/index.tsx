'use client';
import { useIsMutating } from '@tanstack/react-query';

import React from 'react';
import SpinnerLoader from '../spinner-loader';

const MutatingMask = () => {
  const isMutating = useIsMutating({
    predicate: mutation => {
      const meta = mutation.options.meta;
      return !(meta?.ignoreLoadingMask);
    },
  });
  if (!isMutating) return null;
  return (
    <div className="animate-fade fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <SpinnerLoader className="text-white" />
    </div>
  );
};

export default MutatingMask;
