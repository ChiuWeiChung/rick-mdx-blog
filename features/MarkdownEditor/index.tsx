'use client';
// import { uploadMarkdownFile } from '@/actions/markdown';
import { ForwardRefEditor } from '@/components/mdx-editor';
import { Button } from '@/components/ui/button';
import { MDXEditorMethods } from '@mdxeditor/editor';
import React, { useRef } from 'react';


const MarkdownEditor = ({ content }: { content: string }) => {
	const ref = useRef<MDXEditorMethods>(null);

	const handleSave = async () => {
		const markdown = ref.current?.getMarkdown();
		console.log('markdown', markdown);
		// if (markdown) {
		// 	const res = await uploadMarkdownFile(markdown, 'test2');
		// }
	};

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
				<Button onClick={handleSave}>儲存</Button>
			</div>
		</>
	);
};

export default MarkdownEditor;
