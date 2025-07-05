'use client';
import { useIsMutating } from '@tanstack/react-query';

import React from 'react';
import SpinnerLoader from '../spinner-loader';

const MutatingMask = () => {
  const isMutating = useIsMutating({
    predicate: mutation => {
      const variables = mutation.state.variables;

      // TODO: 這邊可以改成用 mutation.options.meta 來判斷，但目前還沒有這個屬性
      // 如果是更新筆記的 visible 狀態，則不顯示遮罩
      if (typeof variables === 'object' && variables && 'noteId' in variables && 'visible' in variables) {
        return false;
      }
      return true;
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
