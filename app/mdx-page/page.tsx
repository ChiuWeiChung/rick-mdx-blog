import React, { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { mdxComponents } from '@/components/mdx-component';

export default async function RemoteMdxPage() {
	// 在服務器端獲取 Markdown 文件
	// const res = await fetch('https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/javascript/KnowJs/callback-queue.markdown');
	// const res = await fetch('https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/javascript/KnowJs/execution-stack-context.markdown');
	const res = await fetch(
		'https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/Docker/1-why_use_docker.md'
	);

	if (!res.ok) {
		return <div>Failed to load content</div>;
	}

	const markdown = await res.text();

	return (
		<Suspense fallback={<div className="p-4 text-center">Loading content...</div>}>
			<article className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none">
				<MDXRemote source={markdown} components={mdxComponents} />
			</article>
		</Suspense>
	);
}
