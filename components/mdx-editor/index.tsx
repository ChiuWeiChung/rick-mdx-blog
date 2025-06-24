'use client';
// ForwardRefEditor.tsx
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor';
import { Loader } from 'lucide-react';

const Editor = dynamic(() => import('./initialized-mdx-editor'), {
  ssr: false,
  loading: () => <Loader className="text-primary mx-auto h-12 w-12 animate-spin" />,
});

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
	<Editor {...props} editorRef={ref} />
));

ForwardRefEditor.displayName = 'ForwardRefEditor';
