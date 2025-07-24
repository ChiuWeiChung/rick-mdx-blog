'use client';
// ForwardRefEditor.tsx
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor';
import SpinnerLoader from '../spinner-loader';

const Editor = dynamic(() => import('./initialized-mdx-editor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">
    編輯器載入中...
    <SpinnerLoader />
  </div>,
});

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
	<Editor {...props} editorRef={ref}/>
));

ForwardRefEditor.displayName = 'ForwardRefEditor';
