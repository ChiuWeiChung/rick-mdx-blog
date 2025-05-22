import React, { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import dynamic from 'next/dynamic';
import { getLanguageFromClassName, isMermaidSyntax } from '@/components/mdx-utils';

// 使用動態導入來加載客戶端元件
const Mermaid = dynamic(() => import('@/components/Mermaid'), { 
  ssr: !!false,
  loading: () => <div className="text-center bg-green-500 text-white p-2">Loading diagram...</div>
});

const CodeBlock = dynamic(() => import('@/components/CodeBlock'), {
  ssr: !!false,
  loading: () => <div className="text-center bg-blue-500 text-white p-2">Loading code snippet...</div>
});


// 為自定義組件定義通用 props 類型
interface CommonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

// 定義增強的MDX組件，改善顯示
const mdxComponents = {
  // 改進代碼區塊顯示
  pre: ({ children }: { children: React.ReactElement; className?: string }) => {
    if (React.isValidElement(children) && children.props && typeof children.props === 'object' && 'className' in children.props) {
      const className = (children.props.className as string) || '';

      // 處理 Mermaid 圖表
      if (isMermaidSyntax(className) && 'children' in children.props) {
        return (
          <Suspense fallback={<div className="text-center bg-green-500 text-white p-2">Loading diagram...</div>}>
            <Mermaid chart={children.props.children as string} />
          </Suspense>
        );
      }

      // 處理其他程式碼塊
      if (className.startsWith('language-') && 'children' in children.props) {
        const language = getLanguageFromClassName(className);
        const codeContent = children.props.children as string;
        return <CodeBlock language={language} code={codeContent} />;
      }
    }

    // 預設的 pre 渲染
    return <pre className="bg-gray-100 text-black p-4 rounded-md shadow-sm overflow-auto w-full my-4">{children}</pre>;
  },

  // 改進標題樣式
  h1: (props: CommonProps) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
  h2: (props: CommonProps) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
  h3: (props: CommonProps) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
  // 改進段落和列表樣式
  p: (props: CommonProps) => <p className="my-3" {...props} />,
  ul: (props: CommonProps) => <ul className="list-disc pl-5 my-3" {...props} />,
  ol: (props: CommonProps) => <ol className="list-decimal pl-5 my-3" {...props} />,
  // 為表格添加滾動支持
  table: (props: CommonProps) => (
    <div className="overflow-x-auto w-full my-4">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  code: (props: CommonProps) => <code className="bg-blue-100 text-black px-1 mx-1 rounded" {...props} />,
  blockquote: (props: CommonProps) => <blockquote className="border-l-2 rounded-lg bg-amber-200 border-gray-300 text-gray-700 px-4 py-2 my-4" {...props} />,
  a: (props: CommonProps) => <a className="text-blue-500 hover:text-blue-700" {...props} />,
};

export default async function RemoteMdxPage() {
  // 在服務器端獲取 Markdown 文件
  // const res = await fetch('https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/javascript/KnowJs/callback-queue.markdown');
  // const res = await fetch('https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/javascript/KnowJs/execution-stack-context.markdown');
  const res = await fetch('https://raw.githubusercontent.com/ChiuWeiChung/notes-markdown/refs/heads/main/Docker/1-why_use_docker.md');
  
  if (!res.ok) {
    return <div>Failed to load content</div>;
  }
  
  const markdown = await res.text();

  return (
    <div className="mdx-page-container flex justify-center w-full">
      <div className="mdx-content w-full max-w-none px-4 md:px-8 py-6 lg:w-[1000px]">
        <Suspense fallback={<div className="p-4 text-center">Loading content...</div>}>
          <article className="prose prose-lg max-w-none">
            <MDXRemote source={markdown} components={mdxComponents} />
          </article>
        </Suspense>
      </div>
    </div>
  );
}
