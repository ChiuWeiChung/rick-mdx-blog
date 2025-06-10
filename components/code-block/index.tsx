'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
	language: string;
	code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('無法複製程式碼', err);
		}
	};

	return (
		<div className="my-4 overflow-hidden rounded-md">
			<div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-sm text-white">
				<span>{language || 'code'}</span>
				<button
					onClick={handleCopy}
					className="copy-button rounded bg-gray-700 px-2 py-1 text-xs transition-colors hover:bg-gray-600"
				>
					{copied ? '已複製!' : '複製'}
				</button>
			</div>
			<SyntaxHighlighter
				language={language || 'javascript'}
				style={oneDark}
				customStyle={{
					margin: 0,
					borderRadius: '0 0 0.375rem 0.375rem',
					fontSize: '0.9rem',
				}}
				showLineNumbers
				wrapLines
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
};

export default CodeBlock;
