'use client';
import { ForwardRefEditor } from '@/components/mdx-editor';
import { Button } from '@/components/ui/button';
import { MDXEditorMethods } from '@mdxeditor/editor';
import React, { useRef } from 'react';

// const markdown = `
// # Hello World
// This is a test markdown
// [Link](https://virtuoso.dev)
// `;

const MarkdownEditor = ({ content }: { content: string }) => {
	const ref = useRef<MDXEditorMethods>(null);

	return (
		<>
			<div className="m-4 rounded-md border border-gray-300 p-4">
				<ForwardRefEditor
					markdown={content}
					contentEditableClassName="prose lg:prose-lg"
					ref={ref}
				/>
			</div>
			<div className="m-4 flex justify-end">
				<Button onClick={() => console.log(ref.current?.getMarkdown())}>儲存</Button>
			</div>
		</>
	);
};

export default MarkdownEditor;
