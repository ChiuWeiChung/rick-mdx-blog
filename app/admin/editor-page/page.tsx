
import { ForwardRefEditor } from '@/components/mdx-editor'
import React from 'react'

const EditorPage = () => {
  const markdown = `
  # Hello World
  This is a test markdown
  `;

  return (
    <div className="m-4 p-4 border border-gray-300 rounded-md">
      <ForwardRefEditor markdown={markdown} contentEditableClassName="prose lg:prose-xl" />
    </div>
  );
}

export default EditorPage