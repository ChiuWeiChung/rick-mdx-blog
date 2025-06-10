import { ForwardRefEditor } from '@/components/mdx-editor';
import React from 'react';

const EditorPage = () => {
	const markdown = `
  # Hello World
  This is a test markdown
  `;

	return (
		<div className="m-4 rounded-md border border-gray-300 p-4">
			<ForwardRefEditor markdown={markdown} contentEditableClassName="prose lg:prose-xl" />
		</div>
	);
};

export default EditorPage;
