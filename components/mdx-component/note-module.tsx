import React from 'react';
import { getLanguageFromClassName, isMermaidSyntax } from '@/utils/mdx-utils';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import { CommonProps } from './types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { placeholderDataUrl } from '@/constants/placeholder';

// 使用動態導入來加載客戶端元件
const Mermaid = dynamic(() => import('@/components/mermaid'), {
  ssr: !!false,
  loading: () => <Loader className="text-primary mx-auto h-12 w-12 animate-spin" />,
});

const CodeBlock = dynamic(() => import('@/components/code-block'), {
  ssr: !!false,
  loading: () => <Loader className="text-primary mx-auto h-12 w-12 animate-spin" />,
});

export function createMdxComponents() {
  let counter = 0;

  return {
    wrapper: (props: CommonProps) => {
      return (
        <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
          {props.children}
        </article>
      );
    },
    // 改進 html 區塊顯示
    pre: ({ children }: { children: React.ReactElement; className?: string }) => {
      if (
        React.isValidElement(children) &&
        children.props &&
        typeof children.props === 'object' &&
        'className' in children.props
      ) {
        const className = (children.props.className as string) || '';

        // 處理 Mermaid 圖表
        if (isMermaidSyntax(className) && 'children' in children.props) {
          return <Mermaid chart={children.props.children as string} />;
        }

        // 處理其他程式碼塊
        if (className.startsWith('language-') && 'children' in children.props) {
          const language = getLanguageFromClassName(className);
          const codeContent = children.props.children as string;
          return <CodeBlock language={language} code={codeContent} />;
        }
      }

      // 預設的 pre 渲染
      return (
        <pre className="my-4 w-full overflow-auto rounded-md bg-gray-100 p-4 text-black shadow-sm">
          {children}
        </pre>
      );
    },

    // 改進標題樣式
    h1: (props: CommonProps) => {
      const blockId = `block-${counter++}`;
      return <h1 {...props} data-block-id={blockId} />;
    },
    h2: (props: CommonProps) => {
      const blockId = `block-${counter++}`;
      return <h2 {...props} data-block-id={blockId} />;
    },
    h3: (props: CommonProps) => {
      const blockId = `block-${counter++}`;
      return <h3 {...props} data-block-id={blockId} />;
    },
    // // 改進段落和列表樣式
    p: (props: CommonProps) => {
      // // 如果 props.children 是 img 標籤，則返回 img 標籤
      if (React.isValidElement(props.children) && props.children.type === 'img') {
        const imgProps = props.children.props as { alt: string; src: string };
        return (
          <div className={cn('relative !my-0 inline-block h-[12rem] md:h-[24rem] w-full')}>
            <Image
              alt={imgProps.alt}
              className={cn('!my-0 object-contain')}
              src={imgProps.src}
              fill
              sizes="100%"
              priority
              placeholder={placeholderDataUrl}
            />
          </div>
        );
      }

      const blockId = `block-${counter++}`;
      return <p {...props} data-block-id={blockId} />;
    },
    li: (props: CommonProps) => {
      const blockId = `block-${counter++}`;
      return <li {...props} data-block-id={blockId} />;
    },
    code: (props: CommonProps) => (
      <code className="bg-secondary text-primary rounded px-1" {...props} />
    ),
    blockquote: (props: CommonProps) => (
      <blockquote
        className="bg-secondary text-primary my-4 rounded-lg border-l-2 px-4 py-2"
        {...props}
      />
    ),
    a: (props: CommonProps) => <a className="text-blue-500 hover:text-blue-700" {...props} />,
  };
}
