import React, { Suspense } from 'react';
import { EvaluateOptions, MDXRemote } from 'next-mdx-remote-client/rsc';
import { createMdxComponents } from '@/components/mdx-component/note-module';
import remarkGfm from 'remark-gfm';

export default async function RemoteMdxPage() {
  // TODO 透過 DB 取得 pathname，並且透過 AWS s3 取得 markdown 文件路徑，並且透過 MDX 渲染
  // 在服務器端獲取 Markdown 文件
  // const res = await fetch('https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/javascript/KnowJs/callback-queue.markdown');
  // const res = await fetch(
  //   'https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/javascript/KnowJs/execution-stack-context.markdown'
  // );
  // const res = await fetch(
  // 	'https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/Docker/1-why_use_docker.md'
  // );
  const res = await fetch(
    'https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/Data_Structure%26Algorithm/sorting/Sort%20Algorithm-2.md'
  );
  // const res = await fetch(
  // 	'https://rick-mdx-storage.s3.us-east-2.amazonaws.com/markdown/test/test.md?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATTPHVNB2BBCZYVF2%2F20250616%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250616T053422Z&X-Amz-Expires=21600&X-Amz-Signature=0614650ca17210a6da810acdbe402052ab02ab256028c0ac0783fbea2b14926e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'
  // );

  if (!res.ok) throw new Error('Oops, 這個筆記可能不存在');
  

  const options: EvaluateOptions = {
    mdxOptions: { remarkPlugins: [remarkGfm] },
    //  parseFrontmatter: true,
    // scope: {
    //   readingTime: calculateSomeHow(source),
    // },
    //  vfileDataIntoScope: 'toc',
  };

  const markdown = await res.text();

  return (
    <Suspense fallback={<div className="p-4 text-center">Loading content...</div>}>
      <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
        <MDXRemote source={markdown} components={createMdxComponents()} options={options} />
      </article>
    </Suspense>
  );
}
